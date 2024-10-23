import { NextApiRequest, NextApiResponse } from 'next';
import { updateUser, findUserByUsername } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const user = findUserByUsername(id as string);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: { ...user, password: undefined } });
  } else if (req.method === 'PUT') {
    if (decoded.userId !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = req.body;
    const updatedUser = updateUser(id as string, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: { ...updatedUser, password: undefined } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}