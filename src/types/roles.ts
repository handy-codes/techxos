export enum UserRole {
  ADMIN = 'admin',
  LECTURER = 'lecturer',
  LEARNER = 'learner'
}

export interface ZoomPermissions {
  canScheduleMeetings: boolean;
  canManageParticipants: boolean;
  canStartMeeting: boolean;
  canRecord: boolean;
  canShareScreen: boolean;
  canUseChat: boolean;
  isCoHost: boolean;
}

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  name: string;
} 