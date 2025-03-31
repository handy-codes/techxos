import { NextApiRequest, NextApiResponse } from 'next';
import { defaultZoomPermissions } from '../../../utils/permissions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { meetingId } = req.body;
    const userRole = req.user?.role;

    // Get user permissions
    const permissions = defaultZoomPermissions[userRole];

    // Generate zoom meeting join URL with appropriate permissions
    const joinUrl = await generateZoomJoinUrl({
      meetingId,
      userId: req.user?.id,
      permissions,
    });

    return res.status(200).json({ joinUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate join URL' });
  }
} 