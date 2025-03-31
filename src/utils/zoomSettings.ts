import { UserRole } from '../types/roles';

export const getZoomMeetingSettings = (userRole: UserRole) => {
  const baseSettings = {
    waiting_room: true,
    join_before_host: false,
    mute_upon_entry: true,
    meeting_authentication: true,
  };

  switch (userRole) {
    case UserRole.ADMIN:
      return {
        ...baseSettings,
        host_video: true,
        participant_video: true,
        audio: 'both',
        screen_sharing: 'host',
        recording_privilege: 'host',
      };
    case UserRole.LECTURER:
      return {
        ...baseSettings,
        host_video: true,
        participant_video: true,
        audio: 'both',
        screen_sharing: 'host',
        recording_privilege: 'host',
      };
    case UserRole.LEARNER:
      return {
        ...baseSettings,
        host_video: false,
        participant_video: false,
        audio: 'both',
        screen_sharing: 'none',
        recording_privilege: 'none',
      };
    default:
      return baseSettings;
  }
}; 