import { ZoomMtg } from '@zoom/meetingsdk';

// Initialize Zoom only on the client side
let isZoomInitialized = false;

export const initZoom = async () => {
  if (typeof window === 'undefined') return;
  
  if (!isZoomInitialized) {
    try {
      const { ZoomClient } = await import('@zoom/meetingsdk');
      await ZoomClient.init();
      isZoomInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Zoom:', error);
      throw error;
    }
  }
};

export type UserRole = 'HEAD_ADMIN' | 'ADMIN' | 'LECTURER' | 'LEARNER';

export const joinMeeting = async (
  meetingId: string,
  userName: string,
  userEmail: string,
  role: string,
  meetingPassword?: string
) => {
  if (typeof window === 'undefined') return;
  
  try {
    await initZoom();
    const { ZoomClient } = await import('@zoom/meetingsdk');
    await ZoomClient.join({
      meetingId,
      userName,
      userEmail,
      role,
      meetingPassword
    });
  } catch (error) {
    console.error('Failed to join meeting:', error);
    throw error;
  }
}; 