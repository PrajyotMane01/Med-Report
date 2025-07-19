import React from 'react';

interface FallbackResultsProps {
  result: string;
}

const FallbackResults: React.FC<FallbackResultsProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-soft-lg animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-400">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {result}
        </div>
      </div>
    </div>
  );
};

export default FallbackResults; 