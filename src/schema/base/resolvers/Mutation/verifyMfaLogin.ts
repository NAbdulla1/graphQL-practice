import { verify } from 'otplib';
import type { MutationResolvers } from './../../../types.generated';

export const verifyMfaLogin: NonNullable<MutationResolvers['verifyMfaLogin']> = async (
  _parent,
  { code },
  { user, req, prisma }
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!user.mfaEnabled || !user.mfaSecret) {
    return {
      success: true,
      isRecovery: false,
    };
  }

  // Try TOTP first if it's 6 digits
  if (code.length === 6) {
    const { valid } = await verify({
      token: code,
      secret: user.mfaSecret,
    });

    if (valid) {
      if (req && req.session) {
        req.session.mfaVerified = true;
      }
      return {
        success: true,
        isRecovery: false,
      };
    }
  }

  // If TOTP fails, try recovery code
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (dbUser && dbUser.mfaRecoveryCodes) {
    const recoveryCodes = dbUser.mfaRecoveryCodes.split(',');
    const codeIndex = recoveryCodes.indexOf(code);

    if (codeIndex !== -1) {
      // Valid recovery code used
      recoveryCodes.splice(codeIndex, 1);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          mfaEnabled: false, // Disable MFA so they can re-setup
          mfaSecret: null,
          mfaRecoveryCodes: recoveryCodes.length > 0 ? recoveryCodes.join(',') : null,
        },
      });

      if (req && req.session) {
        req.session.mfaVerified = true;
      }
      return {
        success: true,
        isRecovery: true,
      };
    }
  }

  return {
    success: false,
    isRecovery: false,
  };
};