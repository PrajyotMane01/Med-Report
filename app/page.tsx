'use client';

import React from 'react';
import Link from 'next/link';
import LoginButton from './components/LoginButton';
import { useAuth } from './components/AuthProvider';
import Footer from './components/Footer';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
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
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/analyze" 
                className="hidden md:block bg-[#4cbe4c] text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-soft-lg transition-all duration-300 font-medium hover:bg-[#3d9b3d]"
              >
                Analyze Report
              </Link>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4cbe4c]"></div>
                </div>
              ) : user ? (
                <LoginButton />
              ) : (
                <Link 
                  href="/signin" 
                  className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Understand Your Medical Reports with
                <span className="text-[#4cbe4c]"> AI</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform complex medical jargon into clear, easy-to-understand explanations. Get instant insights about your health reports with our advanced AI analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/analyze"
                  className="bg-[#4cbe4c] text-white px-8 py-4 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 text-lg font-semibold text-center hover:scale-[1.02] active:scale-[0.98] hover:bg-[#3d9b3d]"
                >
                  Analyze Your Report
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">100% Private</span>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative h-[500px] animate-fade-in hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-effect rounded-2xl p-8 shadow-soft-lg max-w-md transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#4cbe4c] rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Sample Report Analysis</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Cholesterol Level</span>
                        <span className="text-green-600 text-sm font-medium">NORMAL</span>
                      </div>
                      <p className="text-sm text-gray-600">Your cholesterol levels are within the healthy range...</p>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Blood Pressure</span>
                        <span className="text-green-600 text-sm font-medium">NORMAL</span>
                      </div>
                      <p className="text-sm text-gray-600">Your blood pressure readings indicate good cardiovascular health...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}