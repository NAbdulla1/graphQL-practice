import { verify } from 'otplib';
import type { MutationResolvers } from './../../../types.generated';

export const disableMfa: NonNullable<MutationResolvers['disableMfa']> = async (
  _parent,
  { code },
  { user, prisma }
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!user.mfaEnabled || !user.mfaSecret) {
    throw new Error('MFA is not enabled');
  }

  const { valid } = await verify({
    token: code,
    secret: user.mfaSecret,
  });

  if (valid) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    });
    return true;
  }

  return false;
};