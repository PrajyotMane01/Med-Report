# 🏥 MedReports AI - Medical Report Analysis Platform

An AI-powered web application that transforms complex medical reports into clear, understandable explanations. Built with Next.js, Supabase, and advanced AI models for OCR and medical text analysis.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)](https://tailwindcss.com/)

## 🌟 Features

- 🔐 **Secure Authentication** - Google OAuth integration via Supabase
- 🤖 **AI-Powered OCR** - Extract text from medical report images using Together AI
- 🧠 **Medical Analysis** - Advanced AI analysis using Google Gemini AI
- 📊 **Structured Results** - Clear test result categorization (Normal, Abnormal, Concerning)
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices  
- 🔒 **Data Security** - Row-level security and encrypted data storage
- 📈 **Health Scoring** - Automatic health score calculation based on test results
- 📋 **Report History** - Complete analysis history with search and filtering
- ⚡ **Real-time Processing** - Live status updates during analysis
- 🏥 **Medical Compliance** - Comprehensive disclaimers and privacy protection

## 🚀 Live Demo

[Visit MedReports AI](https://your-deployment-url.vercel.app) (Replace with your actual deployment URL)

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15.3.3 with App Router
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Quicksand font from Google Fonts

**Backend & Services:**
- Supabase for authentication and database
- Google Gemini AI (gemma-3-27b-it) for medical analysis
- Together AI (Llama-Vision-Free) for OCR processing
- PostgreSQL database with Row Level Security

**Key Libraries:**
- `@supabase/supabase-js` - Database and auth client
- `@google/generative-ai` - Google AI integration

### Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **medical_reports** - Main report metadata and analysis status
- **test_results** - Individual test results with explanations
- **processing_logs** - Detailed processing history and error tracking
- **user_preferences** - User settings and preferences
- **Custom types** - ENUM types for status validation
- **RLS policies** - Row-level security for data isolation
- **Triggers** - Automatic timestamp and count updates

### API Integrations

1. **Together AI API** - OCR text extraction from images
2. **Google Gemini AI** - Medical report analysis and interpretation
3. **Supabase Auth** - Google OAuth authentication flow
4. **Supabase Database** - Data persistence and real-time updates

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Console account (for OAuth and Gemini AI)
- Together AI account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medical-report.git
cd medical-report
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service API Keys
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_TOGETHER_API_KEY=your_together_api_key
```

### 3. Supabase Setup

#### Create Project & Configure Authentication

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to **Authentication > Providers**
3. Enable **Google** provider
4. Configure OAuth settings:
   - **Site URL**: `http://localhost:3000` (development) / `https://yourdomain.com` (production)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`, `https://yourdomain.com/auth/callback`

#### Database Schema Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query and copy the entire contents of `database-schema.sql`
3. Execute the script to create all tables, functions, and policies

The schema includes:
- Complete table structure with relationships
- Row Level Security (RLS) policies
- Custom functions for data operations
- Triggers for automatic updates
- Indexes for optimal performance

### 4. Google Cloud Console Setup

#### OAuth Configuration

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create/select a project and enable **Google+ API**
3. Create **OAuth 2.0 credentials**
4. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret to Supabase Auth settings

#### Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini AI
3. Add the key to your `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

### 5. Together AI Setup

1. Sign up at [Together AI](https://api.together.xyz)
2. Generate an API key
3. Add the key to your `.env.local` as `NEXT_PUBLIC_TOGETHER_API_KEY`

### 6. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup Guide

The application uses a comprehensive PostgreSQL schema. Refer to `DATABASE_SETUP.md` for detailed setup instructions including:

- Complete table structures and relationships
- Row Level Security (RLS) configuration
- Custom functions and triggers
- Performance optimization indexes
- Sample queries and usage examples

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Using Vercel CLI
   npm install -g vercel
   vercel
   ```

2. **Environment Variables**
   Add all environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `NEXT_PUBLIC_TOGETHER_API_KEY`

3. **Update Supabase Settings**
   - Add production URLs to Supabase Auth configuration
   - Update redirect URLs to include your domain

### Other Deployment Options

- **Netlify**: Configure build settings and environment variables
- **Railway**: Connect GitHub and set environment variables
- **DigitalOcean App Platform**: Use the provided app spec
- **Docker**: Build container using the provided Dockerfile

## 🔧 Configuration

### Custom Styling

The application uses a custom Tailwind CSS configuration with:
- **Custom color palette** - Matt green theme with CSS variables
- **Custom animations** - Fade-in and slide-up effects
- **Glass morphism effects** - Backdrop blur and transparency
- **Responsive design** - Mobile-first approach

### AI Model Configuration

Currently configured models:
- **OCR**: `meta-llama/Llama-Vision-Free` (Together AI)
- **Analysis**: `gemma-3-27b-it` (Google Gemini)

Models can be changed in `app/analyze/page.tsx` by modifying the API calls.

## 📖 Usage Guide

### For End Users

1. **Sign In** - Use Google account to authenticate
2. **Upload Report** - Drag and drop or browse for medical report images
3. **Processing** - Real-time status updates during analysis
4. **Results** - View structured test results with explanations
5. **History** - Access previous analyses in your dashboard

### For Developers

#### Key Components

- **AuthProvider** - Authentication state management
- **FileUpload** - Drag-and-drop file handling with preview
- **TestResults** - Structured display of analysis results
- **ProcessingStatus** - Real-time processing updates
- **DatabaseService** - Complete data layer abstraction

#### API Endpoints

- `GET /auth/callback` - OAuth callback handler
- Custom Supabase functions for data operations
- Real-time subscriptions for live updates

#### Database Operations

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

// Save analysis results
const { error } = await db.saveCompleteAnalysis({
  reportId: report.id,
  patientInfo: 'Patient summary...',
  testResults: [...]
});
```

## 🧪 Testing

```bash
# Run type checking
npm run build

# Run linting
npm run lint

# Development with type checking
npm run dev
```

### Testing Checklist

- [ ] Authentication flow (sign in/out)
- [ ] File upload with different formats
- [ ] OCR text extraction accuracy
- [ ] AI analysis quality
- [ ] Database operations
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
7. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add JSDoc comments for functions
- Ensure proper error handling

### Contribution Ideas

- [ ] Additional AI model integrations
- [ ] Enhanced data visualization
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Export functionality (PDF, CSV)
- [ ] Batch processing capabilities
- [ ] Integration with health platforms

## 🔒 Security & Privacy

### Security Measures

- **Row Level Security (RLS)** - Database-level access control
- **Environment variables** - Secure API key management
- **HTTPS only** - Encrypted data transmission
- **OAuth authentication** - No password storage
- **Input validation** - Comprehensive data sanitization

### Privacy Protection

- **Data encryption** - All sensitive data encrypted at rest
- **User consent** - Clear terms and privacy policies
- **Data retention** - Configurable retention periods
- **GDPR compliance** - User data export and deletion
- **Medical disclaimers** - Clear AI limitation warnings

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for educational and informational purposes only. All AI-generated content may contain errors or inaccuracies and should never be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## 🐛 Troubleshooting

### Common Issues

**Authentication Problems**
- Verify Google OAuth credentials in Supabase
- Check redirect URLs configuration
- Ensure environment variables are set correctly

**Database Errors**
- Verify Supabase connection
- Check RLS policies are properly configured
- Ensure database schema is up to date

**AI Processing Failures**
- Verify API keys for Together AI and Gemini
- Check API rate limits and quotas
- Ensure image format is supported

**Deployment Issues**
- Verify all environment variables in production
- Check build logs for missing dependencies
- Ensure Supabase URLs include production domain

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend-as-a-Service platform
- **Google AI** - Gemini AI model for analysis
- **Together AI** - OCR processing capabilities
- **Vercel** - Deployment and hosting platform
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/medical-report/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/medical-report/discussions)
- **Email**: support@medreports.ai

---

<p align="center">Made with ❤️ for the healthcare community</p>
