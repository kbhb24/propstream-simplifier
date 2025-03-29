import Stripe from 'stripe';
import { supabase } from './supabase';
import type { Plan, Subscription } from '@/types/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (
  userId: string,
  organizationId: string,
  planId: string
) => {
  try {
    // Get the plan details
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Create or get the Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId,
          organizationId,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
      metadata: {
        userId,
        organizationId,
        planId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  try {
    const { userId, organizationId, planId } = subscription.metadata;

    // Update subscription in database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('user_id', userId)
      .eq('organization_id', organizationId);

    if (error) throw error;

    // If subscription is cancelled, update the end date
    if (subscription.status === 'canceled') {
      await supabase
        .from('subscriptions')
        .update({
          ended_at: new Date(subscription.ended_at! * 1000).toISOString(),
        })
        .eq('user_id', userId)
        .eq('organization_id', organizationId);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
};

export const createBillingPortalSession = async (userId: string) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_customer_id) {
      throw new Error('No Stripe customer ID found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    });

    return session;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}; 