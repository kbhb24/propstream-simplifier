
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { handleSubscriptionUpdated } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ message: 'No signature found' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, organizationId, planId } = session.metadata!;

        // Create subscription in database
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            organization_id: organizationId,
            plan_id: planId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          });

        if (subscriptionError) throw subscriptionError;

        // Get plan details
        const { data: plan } = await supabase
          .from('plans')
          .select('monthly_upload_limit')
          .eq('id', planId)
          .single();

        // Create initial upload limit
        const { error: limitError } = await supabase
          .from('upload_limits')
          .insert({
            user_id: userId,
            organization_id: organizationId,
            month: new Date().toISOString().slice(0, 7), // YYYY-MM
            uploads_limit: plan?.monthly_upload_limit || 0,
          });

        if (limitError) throw limitError;
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const { userId, organizationId } = subscription.metadata;

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId)
          .eq('organization_id', organizationId);

        // Send notification to user
        // TODO: Implement notification system
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
