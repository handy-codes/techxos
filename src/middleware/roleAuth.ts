import { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '../types/roles';

export function roleMiddleware(allowedRoles: UserRole[]) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Assuming you have user information in the session/token
      const userRole = req.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Unauthorized: Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error during role verification'
      });
    }
  };
} 