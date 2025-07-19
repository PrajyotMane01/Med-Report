-- Medical Reports AI Database Schema
-- This schema is designed for storing and retrieving medical report analysis data

-- Note: Row Level Security (RLS) is enabled by default in Supabase

-- Create custom types for better data validation
CREATE TYPE test_status AS ENUM ('NORMAL', 'ABNORMAL', 'CONCERNING', 'UNKNOWN');
CREATE TYPE file_status AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- Main table for storing medical report analysis sessions
CREATE TABLE medical_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    original_text TEXT, -- Raw OCR extracted text
    patient_info TEXT, -- AI generated patient summary
    analysis_status file_status DEFAULT 'PROCESSING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Metadata for easy querying
    total_tests INTEGER DEFAULT 0,
    normal_tests INTEGER DEFAULT 0,
    abnormal_tests INTEGER DEFAULT 0,
    concerning_tests INTEGER DEFAULT 0
);

-- Table for storing individual test results
CREATE TABLE test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES medical_reports(id) ON DELETE CASCADE NOT NULL,
    test_name TEXT NOT NULL,
    test_value TEXT NOT NULL,
    status test_status NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Index for faster queries
    CONSTRAINT unique_test_per_report UNIQUE(report_id, test_name)
);

-- Table for storing processing logs and errors
CREATE TABLE processing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES medical_reports(id) ON DELETE CASCADE NOT NULL,
    step TEXT NOT NULL, -- 'OCR', 'AI_ANALYSIS', 'PARSING', etc.
    status TEXT NOT NULL, -- 'STARTED', 'COMPLETED', 'FAILED'
    message TEXT,
    duration_ms INTEGER, -- Processing time in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table for user preferences and settings
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    analysis_history_retention_days INTEGER DEFAULT 365,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_medical_reports_user_id ON medical_reports(user_id);
CREATE INDEX idx_medical_reports_created_at ON medical_reports(created_at DESC);
CREATE INDEX idx_medical_reports_status ON medical_reports(analysis_status);
CREATE INDEX idx_test_results_report_id ON test_results(report_id);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_processing_logs_report_id ON processing_logs(report_id);
CREATE INDEX idx_processing_logs_created_at ON processing_logs(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_medical_reports_updated_at 
    BEFORE UPDATE ON medical_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update test counts when test results are inserted/updated/deleted
CREATE OR REPLACE FUNCTION update_report_test_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        -- Update counts when a test is deleted
        UPDATE medical_reports 
        SET 
            total_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = OLD.report_id),
            normal_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = OLD.report_id AND status = 'NORMAL'),
            abnormal_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = OLD.report_id AND status = 'ABNORMAL'),
            concerning_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = OLD.report_id AND status = 'CONCERNING')
        WHERE id = OLD.report_id;
        RETURN OLD;
    ELSE
        -- Update counts when a test is inserted or updated
        UPDATE medical_reports 
        SET 
            total_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = NEW.report_id),
            normal_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = NEW.report_id AND status = 'NORMAL'),
            abnormal_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = NEW.report_id AND status = 'ABNORMAL'),
            concerning_tests = (SELECT COUNT(*) FROM test_results WHERE report_id = NEW.report_id AND status = 'CONCERNING')
        WHERE id = NEW.report_id;
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Create triggers for test count updates
CREATE TRIGGER update_test_counts_insert
    AFTER INSERT ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_report_test_counts();

CREATE TRIGGER update_test_counts_update
    AFTER UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_report_test_counts();

CREATE TRIGGER update_test_counts_delete
    AFTER DELETE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_report_test_counts();

-- Enable Row Level Security
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view their own medical reports" ON medical_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medical reports" ON medical_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical reports" ON medical_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical reports" ON medical_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Test results policies
CREATE POLICY "Users can view test results for their reports" ON test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = test_results.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert test results for their reports" ON test_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = test_results.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update test results for their reports" ON test_results
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = test_results.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete test results for their reports" ON test_results
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = test_results.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

-- Processing logs policies
CREATE POLICY "Users can view logs for their reports" ON processing_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = processing_logs.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert logs for their reports" ON processing_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM medical_reports 
            WHERE medical_reports.id = processing_logs.report_id 
            AND medical_reports.user_id = auth.uid()
        )
    );

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a view for easy querying of complete report data
CREATE VIEW report_summary AS
SELECT 
    mr.id,
    mr.user_id,
    mr.file_name,
    mr.file_size,
    mr.file_type,
    mr.patient_info,
    mr.analysis_status,
    mr.created_at,
    mr.updated_at,
    mr.total_tests,
    mr.normal_tests,
    mr.abnormal_tests,
    mr.concerning_tests,
    -- Calculate health score (0-100, higher is better)
    CASE 
        WHEN mr.total_tests = 0 THEN 100
        ELSE ROUND(
            (mr.normal_tests::float / mr.total_tests::float) * 100
        )
    END as health_score
FROM medical_reports mr;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON medical_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON test_results TO authenticated;
GRANT SELECT, INSERT ON processing_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_preferences TO authenticated;
GRANT SELECT ON report_summary TO authenticated;

-- Create helpful functions for common operations

-- Function to get a user's recent reports
CREATE OR REPLACE FUNCTION get_user_reports(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    file_name TEXT,
    analysis_status file_status,
    created_at TIMESTAMP WITH TIME ZONE,
    total_tests INTEGER,
    health_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mr.id,
        mr.file_name,
        mr.analysis_status,
        mr.created_at,
        mr.total_tests,
        CASE 
            WHEN mr.total_tests = 0 THEN 100
            ELSE ROUND((mr.normal_tests::float / mr.total_tests::float) * 100)
        END as health_score
    FROM medical_reports mr
    WHERE mr.user_id = p_user_id
    ORDER BY mr.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get complete report with all test results
CREATE OR REPLACE FUNCTION get_report_details(p_report_id UUID)
RETURNS TABLE (
    report_id UUID,
    file_name TEXT,
    patient_info TEXT,
    analysis_status file_status,
    created_at TIMESTAMP WITH TIME ZONE,
    test_name TEXT,
    test_value TEXT,
    status test_status,
    explanation TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mr.id as report_id,
        mr.file_name,
        mr.patient_info,
        mr.analysis_status,
        mr.created_at,
        tr.test_name,
        tr.test_value,
        tr.status,
        tr.explanation
    FROM medical_reports mr
    LEFT JOIN test_results tr ON mr.id = tr.report_id
    WHERE mr.id = p_report_id
    ORDER BY tr.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 