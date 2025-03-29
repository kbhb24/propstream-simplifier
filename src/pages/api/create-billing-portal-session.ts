import { NextApiRequest, NextApiResponse } from 'next';
import { createBillingPortalSession } from '@/lib/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await createBillingPortalSession(userId);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 