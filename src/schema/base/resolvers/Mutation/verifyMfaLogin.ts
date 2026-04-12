import { verify } from 'otplib';
import type { MutationResolvers } from './../../../types.generated';

export const verifyMfaLogin: NonNullable<MutationResolvers['verifyMfaLogin']> = async (
  _parent,
  { code },
  { user, req }
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!user.mfaEnabled || !user.mfaSecret) {
    return true;
  }

  const { valid } = await verify({
    token: code,
    secret: user.mfaSecret,
  });

  if (valid) {
    // If you're using express-session, mark the session as MFA verified
    if (req && req.session) {
      req.session.mfaVerified = true;
    }
    return true;
  }

  return false;
};