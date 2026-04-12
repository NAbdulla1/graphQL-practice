import { generateSecret, generateURI } from 'otplib';
import { toDataURL } from 'qrcode';
import type { MutationResolvers } from './../../../types.generated';


export const generateMfaSecret: NonNullable<MutationResolvers['generateMfaSecret']> = async (
  _parent,
  _arg,
  { user, prisma }
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Generate a new secret using default settings (base32)
  const secret = generateSecret();

  // Create an otpauth:// URL
  const otpauthUrl = generateURI({
    issuer: 'HackerNews Local Practice',
    label: user.email,
    secret,
  });

  // Generate a QR code for the URL
  const qrCodeDataUrl = await toDataURL(otpauthUrl);

  // Store the secret temporarily in the database until it's verified
  await prisma.user.update({
    where: { id: user.id },
    data: { mfaTempSecret: secret },
  });

  return {
    secret,
    otpauthUrl,
    qrCodeDataUrl,
  };
};