import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserSubscription, getPlans } from '@/lib/db';
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

  const { planId } = req.body;

  const plans = getPlans();
  const selectedPlan = plans.find(plan => plan.id === planId);

  if (!selectedPlan) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  // En una aplicación real, aquí se procesaría el pago

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // Suscripción por un mes

  const updatedUser = updateUserSubscription(decoded.userId, planId, endDate.toISOString());

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'Subscription updated successfully', user: { ...updatedUser, password: undefined } });
}