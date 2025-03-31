import { NextApiRequest, NextApiResponse } from 'next';
import { roleMiddleware } from '../../../middleware/roleAuth';
import { UserRole } from '../../../types/roles';
import { getZoomMeetingSettings } from '../../../utils/zoomSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply role middleware
    await roleMiddleware([UserRole.ADMIN, UserRole.LECTURER])(req, res, async () => {
      const { topic, start_time, duration } = req.body;
      const userRole = req.user?.role;

      const meetingSettings = getZoomMeetingSettings(userRole);

      // Create Zoom meeting using your Zoom API client
      const meeting = await createZoomMeeting({
        topic,
        start_time,
        duration,
        settings: meetingSettings,
      });

      return res.status(200).json(meeting);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create meeting' });
  }
} 