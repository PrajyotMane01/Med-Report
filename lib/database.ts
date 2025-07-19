import { createSupabaseClient } from './supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Type definitions for our database schema
export interface MedicalReport {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  original_text?: string;
  patient_info?: string;
  analysis_status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
  total_tests: number;
  normal_tests: number;
  abnormal_tests: number;
  concerning_tests: number;
}

export interface TestResult {
  id: string;
  report_id: string;
  test_name: string;
  test_value: string;
  status: 'NORMAL' | 'ABNORMAL' | 'CONCERNING' | 'UNKNOWN';
  explanation: string;
  created_at: string;
}

export interface ProcessingLog {
  id: string;
  report_id: string;
  step: string;
  status: string;
  message?: string;
  duration_ms?: number;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  analysis_history_retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface ReportSummary {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  patient_info?: string;
  analysis_status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
  total_tests: number;
  normal_tests: number;
  abnormal_tests: number;
  concerning_tests: number;
  health_score: number;
}

export interface ReportDetails {
  report_id: string;
  file_name: string;
  patient_info?: string;
  analysis_status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  test_name?: string;
  test_value?: string;
  status?: 'NORMAL' | 'ABNORMAL' | 'CONCERNING' | 'UNKNOWN';
  explanation?: string;
}

// Database service class
export class DatabaseService {
  private supabase = createSupabaseClient();

  // Medical Reports Operations
  async createMedicalReport(data: {
    user_id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    original_text?: string;
  }): Promise<{ data: MedicalReport | null; error: PostgrestError | null }> {
    const { data: report, error } = await this.supabase
      .from('medical_reports')
      .insert([data])
      .select()
      .single();

    return { data: report, error };
  }

  async updateMedicalReport(
    id: string,
    updates: Partial<MedicalReport>
  ): Promise<{ data: MedicalReport | null; error: PostgrestError | null }> {
    const { data: report, error } = await this.supabase
      .from('medical_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: report, error };
  }

  async getMedicalReport(id: string): Promise<{ data: MedicalReport | null; error: PostgrestError | null }> {
    const { data: report, error } = await this.supabase
      .from('medical_reports')
      .select('*')
      .eq('id', id)
      .single();

    return { data: report, error };
  }

  async getUserReports(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ data: ReportSummary[] | null; error: PostgrestError | null }> {
    const { data: reports, error } = await this.supabase
      .from('report_summary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: reports, error };
  }

  async deleteMedicalReport(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from('medical_reports')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Test Results Operations
  async createTestResults(
    reportId: string,
    testResults: Array<{
      test_name: string;
      test_value: string;
      status: 'NORMAL' | 'ABNORMAL' | 'CONCERNING' | 'UNKNOWN';
      explanation: string;
    }>
  ): Promise<{ data: TestResult[] | null; error: PostgrestError | null }> {
    const testData = testResults.map(test => ({
      report_id: reportId,
      ...test
    }));

    const { data: results, error } = await this.supabase
      .from('test_results')
      .insert(testData)
      .select();

    return { data: results, error };
  }

  async getTestResults(reportId: string): Promise<{ data: TestResult[] | null; error: PostgrestError | null }> {
    const { data: results, error } = await this.supabase
      .from('test_results')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    return { data: results, error };
  }

  async updateTestResult(
    id: string,
    updates: Partial<TestResult>
  ): Promise<{ data: TestResult | null; error: PostgrestError | null }> {
    const { data: result, error } = await this.supabase
      .from('test_results')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: result, error };
  }

  async deleteTestResult(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from('test_results')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Processing Logs Operations
  async createProcessingLog(data: {
    report_id: string;
    step: string;
    status: string;
    message?: string;
    duration_ms?: number;
  }): Promise<{ data: ProcessingLog | null; error: PostgrestError | null }> {
    const { data: log, error } = await this.supabase
      .from('processing_logs')
      .insert([data])
      .select()
      .single();

    return { data: log, error };
  }

  async getProcessingLogs(reportId: string): Promise<{ data: ProcessingLog[] | null; error: PostgrestError | null }> {
    const { data: logs, error } = await this.supabase
      .from('processing_logs')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    return { data: logs, error };
  }

  // User Preferences Operations
  async getUserPreferences(userId: string): Promise<{ data: UserPreferences | null; error: PostgrestError | null }> {
    const { data: preferences, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data: preferences, error };
  }

  async createUserPreferences(data: {
    user_id: string;
    email_notifications?: boolean;
    analysis_history_retention_days?: number;
  }): Promise<{ data: UserPreferences | null; error: PostgrestError | null }> {
    const { data: preferences, error } = await this.supabase
      .from('user_preferences')
      .insert([data])
      .select()
      .single();

    return { data: preferences, error };
  }

  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<{ data: UserPreferences | null; error: PostgrestError | null }> {
    const { data: preferences, error } = await this.supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data: preferences, error };
  }

  // Report Details Operations
  async getReportDetails(reportId: string): Promise<{ data: ReportDetails[] | null; error: PostgrestError | null }> {
    const { data: details, error } = await this.supabase
      .rpc('get_report_details', { p_report_id: reportId });

    return { data: details, error };
  }

  // Utility Functions
  async getReportHealthScore(reportId: string): Promise<{ data: number | null; error: PostgrestError | null }> {
    const { data: report, error } = await this.supabase
      .from('report_summary')
      .select('health_score')
      .eq('id', reportId)
      .single();

    return { data: report?.health_score || null, error };
  }

  async getUserReportStats(userId: string): Promise<{
    data: {
      total_reports: number;
      completed_reports: number;
      average_health_score: number;
      recent_reports: ReportSummary[];
    } | null;
    error: PostgrestError | null;
  }> {
    // Get total reports
    const { count: totalReports, error: countError } = await this.supabase
      .from('medical_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) return { data: null, error: countError };

    // Get completed reports
    const { count: completedReports, error: completedError } = await this.supabase
      .from('medical_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('analysis_status', 'COMPLETED');

    if (completedError) return { data: null, error: completedError };

    // Get recent reports for average health score
    const { data: recentReports, error: recentError } = await this.getUserReports(userId, 50);
    if (recentError) return { data: null, error: recentError };

    const completedRecentReports = recentReports?.filter(r => r.analysis_status === 'COMPLETED') || [];
    const averageHealthScore = completedRecentReports.length > 0
      ? Math.round(completedRecentReports.reduce((sum, r) => sum + r.health_score, 0) / completedRecentReports.length)
      : 0;

    return {
      data: {
        total_reports: totalReports || 0,
        completed_reports: completedReports || 0,
        average_health_score: averageHealthScore,
        recent_reports: recentReports || []
      },
      error: null
    };
  }

  // Batch Operations
  async saveCompleteAnalysis(data: {
    reportId: string;
    patientInfo: string;
    testResults: Array<{
      test_name: string;
      test_value: string;
      status: 'NORMAL' | 'ABNORMAL' | 'CONCERNING' | 'UNKNOWN';
      explanation: string;
    }>;
  }): Promise<{ error: PostgrestError | null }> {
    const { reportId, patientInfo, testResults } = data;

    // Update the medical report with patient info and mark as completed
    const { error: updateError } = await this.updateMedicalReport(reportId, {
      patient_info: patientInfo,
      analysis_status: 'COMPLETED'
    });

    if (updateError) return { error: updateError };

    // Create test results
    const { error: testError } = await this.createTestResults(reportId, testResults);

    return { error: testError };
  }
}

// Export a singleton instance
export const db = new DatabaseService(); 