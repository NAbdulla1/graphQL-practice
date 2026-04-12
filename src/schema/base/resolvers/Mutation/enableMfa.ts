import { verify } from 'otplib';
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
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: dbUser.mfaTempSecret,
        mfaTempSecret: null,
      },
    });
    return true;
  }

  return false;
};