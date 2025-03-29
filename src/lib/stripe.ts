
import Stripe from 'stripe';
import { supabase } from './supabase';

// Create a Stripe instance with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { userId, organizationId } = subscription.metadata || {};
  
  if (!userId || !organizationId) {
    console.error('Missing metadata in subscription:', subscription.id);
    return;
  }
  
  const status = subscription.status;
  
  // Update the subscription status in the database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('user_id', userId)
    .eq('organization_id', organizationId);
  
  if (error) {
    console.error('Error updating subscription:', error);
  }
}

export default stripe;
