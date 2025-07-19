'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FileUpload from '../components/FileUpload';
import ProcessingStatus from '../components/ProcessingStatus';
import PatientInfo from '../components/PatientInfo';
import TestResults from '../components/TestResults';
import FallbackResults from '../components/FallbackResults';
import LoginButton from '../components/LoginButton';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/database';

const AnalyzePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const resultsRef = useRef<HTMLElement>(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirectTo=/analyze');
    }
  }, [user, authLoading, router]);

  const processWithGemini = async (extractedText: string) => {
    try {
      setProcessingStatus('Processing with Google AI...');
      
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

      const prompt = `You are a medical assistant AI that explains medical reports in simple terms for regular people. Please analyze the following medical report and provide a structured analysis. For each test result, output a JSON array with the following fields for each test:

[
  {
    &quot;name&quot;: &quot;Test name (with a simple explanation in parentheses)&quot;,
    &quot;value&quot;: &quot;Test value and unit&quot;,
    &quot;status&quot;: &quot;NORMAL&quot; | &quot;CONCERNING&quot; | &quot;ABNORMAL&quot;,
    &quot;explanation&quot;: &quot;Brief explanation in simple, non-medical language. Explain what this means for the person's health.&quot;
  },
  ...
]

Do not include any markdown, headings, or extra formatting. Only output the JSON array for test results. After the array, output a short patient summary in plain text (not JSON). Here is the medical report:

${extractedText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing with Google AI:', error);
      throw new Error('Failed to process text with Google AI');
    }
  };

  const parseTestResults = (analysisText: string) => {
    let testResults: Array<{ name: string; value: string; status: string; explanation: string }> = [];
    let patientInfo = '';
    
    try {
      const startIdx = analysisText.indexOf('[');
      const endIdx = analysisText.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const jsonString = analysisText.substring(startIdx, endIdx + 1);
        testResults = JSON.parse(jsonString);
        patientInfo = analysisText.substring(endIdx + 1).replace(/^[\n\r]+/, '').trim();
        return { patientInfo, testResults };
      }
    } catch {
      console.log('JSON parsing failed, trying alternative parsing...');
    }
    
    const testBlocks = analysisText.split('---').filter(block => block.trim());
    
    testResults = testBlocks.map(block => {
      const testData = {
        name: '',
        value: '',
        status: 'UNKNOWN',
        explanation: ''
      };
      
      const nameMatch = block.match(/\*\*TEST_NAME:\*\*\s*([^\*]+?)(?=\*\*|$)/);
      if (nameMatch) {
        testData.name = nameMatch[1].trim();
      }
      
      const valueMatch = block.match(/\*\*VALUE:\*\*\s*([^\*]+?)(?=\*\*|$)/);
      if (valueMatch) {
        testData.value = valueMatch[1].trim();
      }
      
      const statusMatch = block.match(/\*\*STATUS:\*\*\s*([^\*]+?)(?=\*\*|$)/);
      if (statusMatch) {
        testData.status = statusMatch[1].trim().toUpperCase();
      }
      
      const explanationMatch = block.match(/\*\*EXPLANATION:\*\*\s*([^\*]+?)(?=\*\*|$)/);
      if (explanationMatch) {
        testData.explanation = explanationMatch[1].trim();
      }
      
      return testData;
    }).filter(test => test.name && test.name.length > 3);
    
    if (testResults.length === 0) {
      patientInfo = analysisText.replace(/\*\*/g, '').replace(/##/g, '');
    }
    
    console.log('Parsed test results:', testResults);
    return { patientInfo, testResults };
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setError('');
    if (!file) {
      // Clear all results when file is removed
      setResult('');
      setProcessingStatus('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Scroll to results section
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);

    try {
      setLoading(true);
      setError('');
      setProcessingStatus('Starting file processing...');
      console.log('Starting file processing...');
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          setProcessingStatus('Converting image...');
          console.log('File read complete, converting to base64...');
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];

          setProcessingStatus('Sending to Together AI for OCR...');
          console.log('Sending request to Together AI...');
          const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "meta-llama/Llama-Vision-Free",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "You are a helpful assistant that extracts text from images. Please extract all text from this image and return it in markdown format. If you cannot read the text clearly, please say so."
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/jpeg;base64,${base64Data}`
                      }
                    }
                  ]
                }
              ],
              max_tokens: 1024
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
          }

          setProcessingStatus('Processing OCR response...');
          const data = await response.json();
          console.log('Received response from Together AI:', data);
          
          if (data.choices && data.choices[0]?.message?.content) {
            const extractedText = data.choices[0].message.content;
            
            // Create medical report in database
            setProcessingStatus('Saving to database...');
            if (!user) {
              setError('User not authenticated. Please sign in to save reports.');
              setProcessingStatus('');
              return;
            }
            
            if (user) {
              const { data: reportData, error: reportError } = await db.createMedicalReport({
                user_id: user.id,
                file_name: file!.name,
                file_size: file!.size,
                file_type: file!.type,
                original_text: extractedText,
              });

              if (reportError) {
                console.error('Error creating medical report:', reportError);
                setError('Failed to save report to database');
                setProcessingStatus('');
                return;
              }

              if (reportData) {
                const processedResult = await processWithGemini(extractedText);
                setResult(processedResult);
                
                // Parse and save the analysis results
                const { patientInfo, testResults } = parseTestResults(processedResult);
                
                if (testResults.length > 0) {
                  const formattedTestResults = testResults.map(test => ({
                    test_name: test.name,
                    test_value: test.value,
                    status: test.status as 'NORMAL' | 'ABNORMAL' | 'CONCERNING' | 'UNKNOWN',
                    explanation: test.explanation
                  }));

                  const { error: saveError } = await db.saveCompleteAnalysis({
                    reportId: reportData.id,
                    patientInfo: patientInfo || 'No patient summary available',
                    testResults: formattedTestResults
                  });

                  if (saveError) {
                    console.error('Error saving analysis results:', saveError);
                    setError('Failed to save analysis results to database');
                  } else {
                    console.log('Analysis saved successfully to database with report ID:', reportData.id);
                  }
                } else {
                  // If no test results, just update the report with patient info
                  const { error: updateError } = await db.updateMedicalReport(reportData.id, {
                    patient_info: patientInfo || processedResult,
                    analysis_status: 'COMPLETED'
                  });

                  if (updateError) {
                    console.error('Error updating medical report:', updateError);
                    setError('Failed to update report in database');
                  }
                }
              }
            }
            
            setProcessingStatus('');
          } else {
            throw new Error('Invalid response format from API');
          }
        } catch (error) {
          console.error('Error in file processing:', error);
          setError(error instanceof Error ? error.message : 'Error processing file');
          setProcessingStatus('');
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setError('Error reading file');
        setProcessingStatus('');
      };

    } catch (error) {
      console.error('Error in submit handler:', error);
      setError(error instanceof Error ? error.message : 'Error processing file');
      setProcessingStatus('');
    } finally {
      setLoading(false);
    }
  };

  const { patientInfo, testResults } = result ? parseTestResults(result) : { patientInfo: '', testResults: [] };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4cbe4c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f0f9f0] flex flex-col">
      {/* Navigation */}
      <nav className="p-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4cbe4c] rounded-lg flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-800">MedReports AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/analyze" 
              className="bg-[#4cbe4c] text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:bg-[#3d9b3d]"
            >
              Analyze Report
            </Link>
            {authLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4cbe4c]"></div>
              </div>
            ) : user ? (
              <LoginButton />
            ) : (
              <Link 
                href="/signin" 
                className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="md:py-36 pt-20 pb-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 md:gap-16 gap-6 items-center">
              {/* Left Column - Instructions */}
              <div className="hidden md:block space-y-10">
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold text-gray-800">
                    Analyze Your Medical Report
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    Get instant, easy-to-understand explanations of your medical reports using our advanced AI analysis.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-800">How it works</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#4cbe4c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-800">Upload your report</h3>
                        <p className="text-sm text-gray-600 mt-1">Simply drag and drop your medical report image or click to browse files.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#4cbe4c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-800">AI Analysis</h3>
                        <p className="text-sm text-gray-600 mt-1">Our AI system reads and analyzes your report, identifying key medical terms and values.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#4cbe4c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-800">Get Results</h3>
                        <p className="text-sm text-gray-600 mt-1">Receive a clear, detailed explanation of your medical report in simple terms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Title */}
              <div className="md:hidden mb-4 mt-4">
                <h1 className="text-2xl font-semibold text-gray-800 px-1">
                  Analyze Your Medical Report
                </h1>
              </div>

              {/* Right Column - File Upload */}
              <div className="md:col-start-2">
                <FileUpload
                  file={file}
                  onFileChange={handleFileChange}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(processingStatus || result) && (
          <section ref={resultsRef} className="pb-8 md:pb-16 pt-8 md:pt-12">
            <div className="max-w-6xl mx-auto px-4 space-y-4 md:space-y-6">
              <ProcessingStatus 
                status={processingStatus} 
                visible={!!processingStatus} 
              />

              {result && (
                <div className="space-y-4 md:space-y-6">
                  <PatientInfo patientInfo={patientInfo} />
                  <TestResults testResults={testResults} />
                  {testResults.length === 0 && (
                    <FallbackResults result={result} />
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Medical Disclaimer */}
        {result && (
          <section className="w-screen pb-8 pt-4 bg-red-50 border-t border-red-200">
            <div className="w-[80vw] mx-auto px-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-red-800 mb-2">
                    Important Medical Disclaimer
                  </h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    <strong>This analysis is AI-generated and may contain errors or inaccuracies.</strong> The information provided is for educational and informational purposes only and should not be considered as medical advice, diagnosis, or treatment recommendations. Always consult with a qualified healthcare professional or doctor for proper medical interpretation of your test results and any health-related decisions. This tool is not a substitute for professional medical consultation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AnalyzePage; 