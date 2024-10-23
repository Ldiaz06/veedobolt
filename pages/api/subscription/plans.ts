import { NextApiRequest, NextApiResponse } from 'next';
import { getPlans } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const plans = getPlans();
  res.status(200).json({ plans });
}