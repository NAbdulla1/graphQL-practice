import { verify } from 'otplib';
import { randomBytes } from 'crypto';
import type { MutationResolvers } from './../../../types.generated';


export const enableMfa: NonNullable<MutationResolvers['enableMfa']> = async (
  _parent,
  { code },
  { user, prisma }
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || !dbUser.mfaTempSecret) {
    throw new Error('MFA setup not initiated');
  }

  const { valid } = await verify({
    token: code,
    secret: dbUser.mfaTempSecret,
  });

  if (valid) {
    // Generate recovery codes
    const recoveryCodes: string[] = [];
    for (let i = 0; i < 10; i++) {
      recoveryCodes.push(randomBytes(4).toString('hex')); // 8 characters hex
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: dbUser.mfaTempSecret,
        mfaTempSecret: null,
        mfaRecoveryCodes: recoveryCodes.join(','),
      },
    });

    return {
      success: true,
      recoveryCodes,
    };
  }

  return {
    success: false,
    recoveryCodes: null,
  };
};