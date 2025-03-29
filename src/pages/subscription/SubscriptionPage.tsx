import React from 'react';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>
              Manage your subscription, billing, and plan details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 