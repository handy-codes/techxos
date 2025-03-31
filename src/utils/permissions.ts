import { UserRole, ZoomPermissions } from '../types/roles';

export const defaultZoomPermissions: Record<UserRole, ZoomPermissions> = {
  [UserRole.ADMIN]: {
    canScheduleMeetings: true,
    canManageParticipants: true,
    canStartMeeting: true,
    canRecord: true,
    canShareScreen: true,
    canUseChat: true,
    isCoHost: true,
  },
  [UserRole.LECTURER]: {
    canScheduleMeetings: true,
    canManageParticipants: true,
    canStartMeeting: true,
    canRecord: true,
    canShareScreen: true,
    canUseChat: true,
    isCoHost: true,
  },
  [UserRole.LEARNER]: {
    canScheduleMeetings: false,
    canManageParticipants: false,
    canStartMeeting: false,
    canRecord: false,
    canShareScreen: false,
    canUseChat: true,
    isCoHost: false,
  },
}; 