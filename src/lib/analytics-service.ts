import { supabase } from './supabase';
import type { Database } from '@/types/database';

export interface ActivityAnalytics {
  total_activities: number;
  activities_by_type: Record<string, number>;
  activities_by_user: Record<string, number>;
  activities_by_day: Record<string, number>;
  top_actions: Record<string, number>;
  top_entities: Record<string, number>;
}

export interface UserActivityMetrics {
  total_activities: number;
  average_daily_activities: number;
  most_active_hour: number;
  most_active_day: string;
  activity_trend: Record<string, number>;
}

export interface EntityActivityMetrics {
  total_activities: number;
  activities_by_action: Record<string, number>;
  activities_by_user: Record<string, number>;
  activity_trend: Record<string, number>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private userId: string | null = null;
  private organizationId: string | null = null;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  setContext(userId: string, organizationId: string) {
    this.userId = userId;
    this.organizationId = organizationId;
  }

  async getActivityAnalytics(
    startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: Date = new Date()
  ): Promise<ActivityAnalytics> {
    if (!this.organizationId) {
      throw new Error('Organization ID not set');
    }

    const { data, error } = await supabase.rpc('get_activity_analytics', {
      p_organization_id: this.organizationId,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
    });

    if (error) throw error;
    return data;
  }

  async getUserActivityMetrics(days: number = 30): Promise<UserActivityMetrics> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const { data, error } = await supabase.rpc('get_user_activity_metrics', {
      p_user_id: this.userId,
      p_days: days,
    });

    if (error) throw error;
    return data;
  }

  async getEntityActivityMetrics(
    entityType: string,
    days: number = 30
  ): Promise<EntityActivityMetrics> {
    if (!this.organizationId) {
      throw new Error('Organization ID not set');
    }

    const { data, error } = await supabase.rpc('get_entity_activity_metrics', {
      p_organization_id: this.organizationId,
      p_entity_type: entityType,
      p_days: days,
    });

    if (error) throw error;
    return data;
  }
} 