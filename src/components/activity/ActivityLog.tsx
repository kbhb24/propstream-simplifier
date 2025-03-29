import React, { useEffect, useState } from 'react';
import { ActivityLogger } from '@/lib/activity-logger';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  changes: any[];
  created_at: string;
}

export const ActivityLog: React.FC = () => {
  const { user, organization } = useAuth();
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const activityLogger = ActivityLogger.getInstance();

  useEffect(() => {
    if (user && organization) {
      activityLogger.setContext(user.id, organization.id);
      loadActivities();
    }
  }, [user, organization]);

  const loadActivities = async () => {
    try {
      const data = await activityLogger.getRecentActivity(50);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      case 'view':
        return 'bg-gray-500';
      case 'login':
        return 'bg-purple-500';
      case 'logout':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatChanges = (changes: any[]) => {
    if (!changes) return null;

    return changes.map((change, index) => (
      <div key={index} className="text-sm text-muted-foreground">
        <span className="font-medium">{change.field_name}:</span>{' '}
        <span className="line-through">{JSON.stringify(change.old_value)}</span>{' '}
        → <span>{JSON.stringify(change.new_value)}</span>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Track changes and actions in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg border"
              >
                <Badge
                  className={`${getActionColor(activity.action)} text-white`}
                >
                  {activity.action}
                </Badge>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {activity.entity_type.charAt(0).toUpperCase() +
                        activity.entity_type.slice(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-muted-foreground">
                      {JSON.stringify(activity.details)}
                    </p>
                  )}
                  {formatChanges(activity.changes)}
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No recent activity
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 