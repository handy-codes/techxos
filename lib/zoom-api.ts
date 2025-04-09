import axios from 'axios';
import { ZoomMeetingStatus } from '@prisma/client';

// Zoom API credentials
const ZOOM_API_KEY = process.env.ZOOM_API_KEY!;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET!;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

// Generate JWT token for Zoom API
export const getZoomToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      null,
      {
        params: {
          grant_type: 'account_credentials',
          account_id: ZOOM_ACCOUNT_ID
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error generating Zoom token:', error);
    throw new Error('Failed to generate Zoom token');
  }
};

// Zoom API base instance
const zoomApi = async () => {
  const token = await getZoomToken();
  return axios.create({
    baseURL: 'https://api.zoom.us/v2',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Interface for creating a Zoom meeting
export interface CreateZoomMeetingParams {
  topic: string;
  agenda?: string;
  start_time: string; // ISO string
  duration: number; // minutes
  password?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    waiting_room?: boolean;
    approval_type?: number;
    registration_type?: number;
    audio?: string;
    auto_recording?: string;
    alternative_hosts?: string;
  };
}

// Create a new Zoom meeting
export const createZoomMeeting = async (params: CreateZoomMeetingParams, userId?: string) => {
  try {
    const api = await zoomApi();
    
    // If userId is provided, create the meeting for that user
    // Otherwise create it for the authenticated user
    const endpoint = userId ? `/users/${userId}/meetings` : '/users/me/meetings';
    
    const response = await api.post(endpoint, params);
    return response.data;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw new Error('Failed to create Zoom meeting');
  }
};

// Get a Zoom meeting by ID
export const getZoomMeeting = async (meetingId: string) => {
  try {
    const api = await zoomApi();
    const response = await api.get(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting Zoom meeting ${meetingId}:`, error);
    throw new Error('Failed to get Zoom meeting');
  }
};

// Update a Zoom meeting
export const updateZoomMeeting = async (meetingId: string, params: Partial<CreateZoomMeetingParams>) => {
  try {
    const api = await zoomApi();
    const response = await api.patch(`/meetings/${meetingId}`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating Zoom meeting ${meetingId}:`, error);
    throw new Error('Failed to update Zoom meeting');
  }
};

// Delete a Zoom meeting
export const deleteZoomMeeting = async (meetingId: string) => {
  try {
    const api = await zoomApi();
    await api.delete(`/meetings/${meetingId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting Zoom meeting ${meetingId}:`, error);
    throw new Error('Failed to delete Zoom meeting');
  }
};

// Get meeting participants
export const getZoomMeetingParticipants = async (meetingId: string) => {
  try {
    const api = await zoomApi();
    const response = await api.get(`/report/meetings/${meetingId}/participants`);
    return response.data;
  } catch (error) {
    console.error(`Error getting Zoom meeting participants for ${meetingId}:`, error);
    throw new Error('Failed to get meeting participants');
  }
};

// Start a Zoom meeting
export const startZoomMeeting = async (meetingId: string) => {
  try {
    // In Zoom API, there's no direct "start" endpoint
    // Users join via the start_url which automatically makes them the host
    const api = await zoomApi();
    const meeting = await api.get(`/meetings/${meetingId}`);
    
    // Return the start URL which can be used to start the meeting
    return {
      startUrl: meeting.data.start_url,
      status: ZoomMeetingStatus.STARTED
    };
  } catch (error) {
    console.error(`Error starting Zoom meeting ${meetingId}:`, error);
    throw new Error('Failed to start Zoom meeting');
  }
};

// End a Zoom meeting
export const endZoomMeeting = async (meetingId: string) => {
  try {
    const api = await zoomApi();
    await api.put(`/meetings/${meetingId}/status`, { action: 'end' });
    return {
      status: ZoomMeetingStatus.ENDED
    };
  } catch (error) {
    console.error(`Error ending Zoom meeting ${meetingId}:`, error);
    throw new Error('Failed to end Zoom meeting');
  }
};

// Get meeting recordings
export const getZoomMeetingRecordings = async (meetingId: string) => {
  try {
    const api = await zoomApi();
    const response = await api.get(`/meetings/${meetingId}/recordings`);
    return response.data;
  } catch (error) {
    console.error(`Error getting Zoom meeting recordings for ${meetingId}:`, error);
    throw new Error('Failed to get meeting recordings');
  }
};

// Generate a join URL for a meeting
export const generateZoomJoinUrl = (meetingId: string, password?: string): string => {
  const url = `https://zoom.us/j/${meetingId}`;
  return password ? `${url}?pwd=${password}` : url;
};

// Parse Zoom date format to JavaScript Date
export const parseZoomDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Format JavaScript Date to Zoom format (YYYY-MM-DDThh:mm:ss)
export const formatDateForZoom = (date: Date): string => {
  return date.toISOString();
};

// Map Zoom meeting status to our enum
export const mapZoomStatus = (zoomStatus: string): ZoomMeetingStatus => {
  switch (zoomStatus.toLowerCase()) {
    case 'waiting':
      return ZoomMeetingStatus.SCHEDULED;
    case 'started':
      return ZoomMeetingStatus.STARTED;
    case 'finished':
      return ZoomMeetingStatus.ENDED;
    default:
      return ZoomMeetingStatus.SCHEDULED;
  }
}; 