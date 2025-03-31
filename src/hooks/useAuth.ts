import { UserResource } from '@/types/user';

interface AuthContext {
  user: UserResource | null;
  // ... other auth-related properties
}

export const useAuth = (): AuthContext => {
  // Your auth hook implementation
}; 