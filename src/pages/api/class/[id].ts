import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUserAccess, secureEndpoint } from '../../../utils/security';
import { UserRole } from '../../../types/roles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // First, verify user access
  await verifyUserAccess(req, res, async () => {
    const { id } = req.query;
    const { role } = req.user;

    switch (req.method) {
      case 'POST': // Creating a class
        await secureEndpoint(req, res, [UserRole.ADMIN, UserRole.LECTURER]);
        // Create class logic here
        break;

      case 'GET': // Joining a class
        await secureEndpoint(req, res, [UserRole.ADMIN, UserRole.LECTURER, UserRole.LEARNER]);
        // Join class logic here
        break;

      default:
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
} 