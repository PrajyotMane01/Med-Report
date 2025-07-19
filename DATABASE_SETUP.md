# Database Setup Guide for MedReports AI

This guide will help you set up the database schema in Supabase for storing medical report analysis data.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Your Supabase URL and anon key (found in Project Settings > API)

## Environment Variables

Make sure you have these environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema Setup

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section in the left sidebar
3. Click "New Query"

### Step 2: Run the Schema Script

1. Copy the entire contents of `database-schema.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the script

### Step 3: Verify the Setup

After running the script, you should see these tables created:

- `medical_reports` - Main table for storing report metadata
- `test_results` - Individual test results for each report
- `processing_logs` - Processing history and error logs
- `user_preferences` - User settings and preferences
- `report_summary` - View for easy querying of report data

## Database Schema Overview

### Tables

#### 1. `medical_reports`
Stores the main information about each medical report analysis:
- **id**: Unique identifier (UUID)
- **user_id**: Reference to the authenticated user
- **file_name**: Original filename
- **file_size**: File size in bytes
- **file_type**: File MIME type
- **original_text**: Raw OCR extracted text
- **patient_info**: AI-generated patient summary
- **analysis_status**: Processing status (PROCESSING/COMPLETED/FAILED)
- **total_tests**: Count of all tests in the report
- **normal_tests**: Count of normal test results
- **abnormal_tests**: Count of abnormal test results
- **concerning_tests**: Count of concerning test results

#### 2. `test_results`
Stores individual test results from each report:
- **id**: Unique identifier (UUID)
- **report_id**: Reference to the medical report
- **test_name**: Name of the test
- **test_value**: Test value and unit
- **status**: Test status (NORMAL/ABNORMAL/CONCERNING/UNKNOWN)
- **explanation**: AI-generated explanation

#### 3. `processing_logs`
Tracks processing steps and errors:
- **id**: Unique identifier (UUID)
- **report_id**: Reference to the medical report
- **step**: Processing step (OCR, AI_ANALYSIS, PARSING, etc.)
- **status**: Step status (STARTED, COMPLETED, FAILED)
- **message**: Additional information or error message
- **duration_ms**: Processing time in milliseconds

#### 4. `user_preferences`
Stores user settings:
- **id**: Unique identifier (UUID)
- **user_id**: Reference to the authenticated user
- **email_notifications**: Whether to send email notifications
- **analysis_history_retention_days**: How long to keep analysis history

### Views

#### `report_summary`
A convenient view that combines report data with calculated health scores:
- All fields from `medical_reports`
- **health_score**: Calculated health score (0-100, higher is better)

### Functions

#### `get_user_reports(user_id, limit, offset)`
Returns a user's recent reports with health scores.

#### `get_report_details(report_id)`
Returns complete report details with all test results.

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Users can only modify their own reports
- Test results are linked to user-owned reports

### Data Validation
- Custom ENUM types for status fields
- Unique constraints to prevent duplicate test names per report
- Foreign key constraints for data integrity

## Usage Examples

### Using the Database Service

```typescript
import { db } from '@/lib/database';

// Create a new medical report
const { data: report, error } = await db.createMedicalReport({
  user_id: user.id,
  file_name: 'blood_test.pdf',
  file_size: 1024000,
  file_type: 'application/pdf',
  original_text: 'Raw OCR text...'
});

// Save complete analysis results
const { error } = await db.saveCompleteAnalysis({
  reportId: report.id,
  patientInfo: 'Patient summary...',
  testResults: [
    {
      test_name: 'Cholesterol',
      test_value: '180 mg/dL',
      status: 'NORMAL',
      explanation: 'Your cholesterol levels are within normal range...'
    }
  ]
});

// Get user's recent reports
const { data: reports } = await db.getUserReports(user.id, 10, 0);

// Get complete report details
const { data: details } = await db.getReportDetails(reportId);
```

## Performance Optimizations

### Indexes
The schema includes indexes on:
- `user_id` for fast user-specific queries
- `created_at` for chronological sorting
- `analysis_status` for filtering by status
- `report_id` for joining with test results

### Triggers
- Automatic `updated_at` timestamp updates
- Automatic test count updates when test results change

## Monitoring and Maintenance

### Processing Logs
Use the `processing_logs` table to:
- Track processing performance
- Debug failed analyses
- Monitor system health

### Health Scores
The `health_score` field provides a quick overview of report health:
- 100: All tests normal
- 75: 75% of tests normal
- 0: All tests abnormal

## Backup and Recovery

### Regular Backups
Supabase automatically handles backups, but you can also:
1. Export data using the Supabase dashboard
2. Use the SQL Editor to create custom backup scripts
3. Set up automated backups using Supabase's API

### Data Retention
The schema includes user preferences for data retention:
- Users can set how long to keep analysis history
- Implement cleanup jobs based on retention settings

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure users are authenticated before accessing data
2. **Foreign Key Violations**: Make sure referenced records exist
3. **Permission Denied**: Check that RLS policies are correctly configured

### Debug Queries

```sql
-- Check user's reports
SELECT * FROM report_summary WHERE user_id = 'user-uuid';

-- Check processing logs for a report
SELECT * FROM processing_logs WHERE report_id = 'report-uuid' ORDER BY created_at;

-- Check test results
SELECT * FROM test_results WHERE report_id = 'report-uuid';
```

## Next Steps

1. **Test the Schema**: Create some test data to verify everything works
2. **Implement the Frontend**: Use the database service in your React components
3. **Add Analytics**: Create additional views for user analytics
4. **Set up Monitoring**: Implement error tracking and performance monitoring

For questions or issues, refer to the [Supabase documentation](https://supabase.com/docs) or create an issue in the project repository. 