import { supabase } from './supabase';
import type { Database } from '@/types/database';

type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'subscribe'
  | 'unsubscribe'
  | 'upload'
  | 'download';

type EntityType =
  | 'record'
  | 'organization'
  | 'subscription'
  | 'user'
  | 'file'
  | 'task'
  | 'attempt'
  | 'offer';

interface ActivityDetails {
  [key: string]: any;
}

interface FieldChange {
  field_name: string;
  old_value: any;
  new_value: any;
}

export class ActivityLogger {
  private static instance: ActivityLogger;
  private userId: string | null = null;
  private organizationId: string | null = null;

  private constructor() {}

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  setContext(userId: string, organizationId: string) {
    this.userId = userId;
    this.organizationId = organizationId;
  }

  private async logActivity(
    action: ActivityAction,
    entityType: EntityType,
    entityId: string | null,
    details: ActivityDetails = {},
    changes: FieldChange[] = []
  ) {
    if (!this.userId || !this.organizationId) {
      console.error('ActivityLogger: Context not set');
      return;
    }

    try {
      // Get client info
      const ipAddress = await this.getClientIp();
      const userAgent = navigator.userAgent;

      // Log the activity
      const { data: activityLog, error: activityError } = await supabase
        .rpc('log_activity', {
          p_user_id: this.userId,
          p_organization_id: this.organizationId,
          p_action: action,
          p_entity_type: entityType,
          p_entity_id: entityId,
          p_details: details,
          p_ip_address: ipAddress,
          p_user_agent: userAgent,
        });

      if (activityError) throw activityError;

      // Log field changes if any
      if (changes.length > 0 && activityLog) {
        for (const change of changes) {
          const { error: changeError } = await supabase.rpc('log_field_changes', {
            p_activity_log_id: activityLog,
            p_field_name: change.field_name,
            p_old_value: change.old_value,
            p_new_value: change.new_value,
          });

          if (changeError) throw changeError;
        }
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  private async getClientIp(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return 'unknown';
    }
  }

  // Activity logging methods
  async logRecordCreation(recordId: string, details: ActivityDetails = {}) {
    await this.logActivity('create', 'record', recordId, details);
  }

  async logRecordUpdate(
    recordId: string,
    changes: FieldChange[],
    details: ActivityDetails = {}
  ) {
    await this.logActivity('update', 'record', recordId, details, changes);
  }

  async logRecordDeletion(recordId: string, details: ActivityDetails = {}) {
    await this.logActivity('delete', 'record', recordId, details);
  }

  async logRecordView(recordId: string, details: ActivityDetails = {}) {
    await this.logActivity('view', 'record', recordId, details);
  }

  async logSubscriptionChange(
    subscriptionId: string,
    changes: FieldChange[],
    details: ActivityDetails = {}
  ) {
    await this.logActivity('update', 'subscription', subscriptionId, details, changes);
  }

  async logFileUpload(fileId: string, details: ActivityDetails = {}) {
    await this.logActivity('upload', 'file', fileId, details);
  }

  async logFileDownload(fileId: string, details: ActivityDetails = {}) {
    await this.logActivity('download', 'file', fileId, details);
  }

  async logTaskCreation(taskId: string, details: ActivityDetails = {}) {
    await this.logActivity('create', 'task', taskId, details);
  }

  async logTaskUpdate(
    taskId: string,
    changes: FieldChange[],
    details: ActivityDetails = {}
  ) {
    await this.logActivity('update', 'task', taskId, details, changes);
  }

  async logAttemptCreation(attemptId: string, details: ActivityDetails = {}) {
    await this.logActivity('create', 'attempt', attemptId, details);
  }

  async logOfferCreation(offerId: string, details: ActivityDetails = {}) {
    await this.logActivity('create', 'offer', offerId, details);
  }

  async logUserLogin(details: ActivityDetails = {}) {
    await this.logActivity('login', 'user', null, details);
  }

  async logUserLogout(details: ActivityDetails = {}) {
    await this.logActivity('logout', 'user', null, details);
  }

  async logUserView(page: string, details: ActivityDetails = {}) {
    await this.logActivity('view', 'user', null, { page, ...details });
  }

  // Activity retrieval methods
  async getRecentActivity(limit: number = 50) {
    const { data, error } = await supabase
      .from('activity_log_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getUserActivitySummary(days: number = 30) {
    const { data, error } = await supabase.rpc('get_user_activity_summary', {
      p_user_id: this.userId,
      p_days: days,
    });

    if (error) throw error;
    return data;
  }

  async getEntityActivity(
    entityType: EntityType,
    entityId: string,
    limit: number = 50
  ) {
    const { data, error } = await supabase
      .from('activity_log_details')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
} 