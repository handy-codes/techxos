import { UserRole } from '@prisma/client';

export interface UserResource {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  // ... any other user properties
} 