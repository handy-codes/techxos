import crypto from 'crypto';

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

export const generateZoomSignature = (meetingNumber: string, role: number): string => {
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(ZOOM_ACCOUNT_ID + meetingNumber + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', ZOOM_CLIENT_SECRET).update(msg).digest('base64');
  return Buffer.from(`${ZOOM_ACCOUNT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
}; 