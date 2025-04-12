import { ZoomMtg } from '@zoom/meetingsdk';

// Initialize Zoom only on the client side
let isZoomInitialized = false;

export const initZoom = async () => {
  if (typeof window === 'undefined') return;
  
  if (!isZoomInitialized) {
    try {
      // ZoomMtg.init() requires a config object
      await ZoomMtg.init({
        leaveUrl: window.location.origin,
        success: () => {
          console.log('Zoom initialized successfully');
        },
        error: (error: any) => {
          console.error('Zoom initialization error:', error);
        }
      });
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
    
    // Generate a signature for the meeting
    // In a real implementation, this would come from your backend
    const signature = ''; // This should be generated on the server
    
    await ZoomMtg.join({
      meetingNumber: meetingId,
      userName: userName,
      userEmail: userEmail,
      passWord: meetingPassword,
      signature: signature,
      success: () => {
        console.log('Joined meeting successfully');
      },
      error: (error: any) => {
        console.error('Failed to join meeting:', error);
      }
    });
  } catch (error) {
    console.error('Failed to join meeting:', error);
    throw error;
  }
}; 