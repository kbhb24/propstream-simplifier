import { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, organizationId, planId } = req.body;

    if (!userId || !organizationId || !planId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await createCheckoutSession(userId, organizationId, planId);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 