import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import type { Plan, Subscription, UploadLimit } from '@/types/database';

export const SubscriptionManager: React.FC = () => {
  const { user, organization, subscription, plan } = useAuth();
  const { toast } = useToast();
  const [uploadLimit, setUploadLimit] = useState<UploadLimit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && organization) {
      fetchUploadLimit();
    }
  }, [user, organization]);

  const fetchUploadLimit = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { data, error } = await supabase
        .from('upload_limits')
        .select('*')
        .eq('user_id', user?.id)
        .eq('organization_id', organization?.id)
        .eq('month', currentMonth)
        .single();

      if (error) throw error;
      setUploadLimit(data);
    } catch (error) {
      console.error('Error fetching upload limit:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upload limit information.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      // Redirect to Stripe checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          organizationId: organization?.id,
          planId: plan?.id,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate upgrade process.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription?.id);

      if (error) throw error;

      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled successfully.',
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading subscription information...</div>;
  }

  const uploadProgress = uploadLimit
    ? (uploadLimit.uploads_used / uploadLimit.uploads_limit) * 100
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            {plan?.name} - ${plan?.price}/month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Monthly Upload Limit</h4>
              <Progress value={uploadProgress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {uploadLimit?.uploads_used || 0} of {uploadLimit?.uploads_limit || 0} uploads used
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Features</h4>
              <ul className="mt-2 space-y-1">
                {plan?.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleUpgrade}>Upgrade Plan</Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your payment method and billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Next Billing Date</h4>
              <p className="text-sm text-muted-foreground">
                {subscription?.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/billing'}>
              Manage Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 