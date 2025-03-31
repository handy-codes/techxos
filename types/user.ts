export type UserRole = 'ADMIN' | 'LECTURER' | 'LEARNER';

export interface UserResource {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
} 