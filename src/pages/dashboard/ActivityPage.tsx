import React from 'react';
import { ActivityLog } from '@/components/activity/ActivityLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityLogger } from '@/lib/activity-logger';
import { useAuth } from '@/contexts/AuthContext';

export default function ActivityPage() {
  const { user, organization } = useAuth();
  const activityLogger = ActivityLogger.getInstance();

  React.useEffect(() => {
    if (user && organization) {
      activityLogger.setContext(user.id, organization.id);
      activityLogger.logUserView('activity_page');
    }
  }, [user, organization]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Track all changes and actions in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityLog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 