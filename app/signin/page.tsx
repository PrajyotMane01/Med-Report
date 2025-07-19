'use client';

import React from 'react';
import Link from 'next/link';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  return (
    <div className="min-h-screen bg-[#f0f9f0] flex flex-col">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4cbe4c] rounded-xl flex items-center justify-center shadow-soft">
              <svg 
                className="w-6 h-6 text-white" 
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
            <span className="text-xl font-semibold text-gray-800">MedReports AI</span>
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Sign In Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-soft-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#4cbe4c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to continue</h1>
              <p className="text-gray-600">
                Please sign in to access the medical report analysis feature
              </p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <LoginButton size="large" />
              
              <div className="text-sm text-gray-500">
                <p>
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-[#4cbe4c] hover:underline">
                    terms of service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#4cbe4c] hover:underline">
                    privacy policy
                  </Link>
                </p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
} 