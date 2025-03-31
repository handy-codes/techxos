import jwt from 'jsonwebtoken';
import { UserRole } from '../types/roles';

// Middleware to verify user roles and permissions
export const verifyUserAccess = async (req: any, res: any, next: any) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    // Check if user has required role
    if (!req.user.role) {
      return res.status(403).json({ error: 'No role assigned' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Generate secure meeting tokens
export const generateMeetingToken = async (
  meetingId: string,
  userId: string,
  role: UserRole
) => {
  const payload = {
    meetingId,
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
  };

  return jwt.sign(payload, process.env.ZOOM_SDK_SECRET!);
};

// Secure API endpoint implementation
export const secureEndpoint = async (req: any, res: any, allowedRoles: UserRole[]) => {
  try {
    const user = req.user;
    
    // Check if user role is allowed
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return res.status(429).json({ 
        error: 'Too many requests, please try again later' 
      });
    }

    // Audit logging
    await logAuditTrail({
      userId: user.id,
      action: req.method,
      resource: req.url,
      timestamp: new Date(),
    });

  } catch (error) {
    return res.status(500).json({ error: 'Security check failed' });
  }
};

// Implementation example in an API route 