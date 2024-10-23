import { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { templateId } = req.body;

  if (typeof templateId !== 'number') {
    return res.status(400).json({ message: 'Invalid template ID' });
  }

  const updatedUser = updateUser(decoded.userId, { templateId });

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'Template updated successfully', user: { ...updatedUser, password: undefined } });
}