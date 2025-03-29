
import Stripe from 'stripe';
import { supabase } from './supabase';

// Create a Stripe instance with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
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

// Add the missing functions for checkout and billing portal
export async function createCheckoutSession(userId: string, organizationId: string, planId: string) {
  // Get the user's email
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();

  if (userError) {
    throw userError;
  }

  // Get the plan details
  const { data: planData, error: planError } = await supabase
    .from('plans')
    .select('price')
    .eq('id', planId)
    .single();

  if (planError) {
    throw planError;
  }

  // Create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Subscription',
          },
          unit_amount: Math.round(planData.price * 100), // Convert to cents
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
    customer_email: userData.email,
    metadata: {
      userId,
      organizationId,
      planId,
    },
  });

  return session;
}

export async function createBillingPortalSession(userId: string) {
  // Get the user's Stripe customer ID
  const { data: subscriptionData, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (subError) {
    throw subError;
  }

  if (!subscriptionData.payment_method_id) {
    throw new Error('No payment method found');
  }

  // Create a billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: subscriptionData.payment_method_id,
    return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard`,
  });

  return session;
}

export default stripe;
