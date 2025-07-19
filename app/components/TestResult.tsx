import React from 'react';

interface TestResultProps {
  name: string;
  value: string;
  status: string;
  explanation: string;
}

const TestResult: React.FC<TestResultProps> = ({ name, value, status, explanation }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return {
          statusBg: 'bg-green-50',
          statusText: 'text-green-700',
          statusDot: 'bg-green-500'
        };
      case 'CONCERNING':
        return {
          statusBg: 'bg-amber-50',
          statusText: 'text-amber-700',
          statusDot: 'bg-amber-500'
        };
      case 'ABNORMAL':
        return {
          statusBg: 'bg-red-50',
          statusText: 'text-red-700',
          statusDot: 'bg-red-500'
        };
      default:
        return {
          statusBg: 'bg-gray-50',
          statusText: 'text-gray-700',
          statusDot: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-3">{name}</h4>
        <div className={`
          flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
          ${config.statusBg} ${config.statusText}
        `}>
          <div className={`w-1.5 h-1.5 rounded-full ${config.statusDot}`}></div>
          <span>{status}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-2 mb-3">
        <p className="font-medium text-gray-900 text-sm">{value}</p>
      </div>
      
      <p className="text-xs text-gray-600 leading-relaxed">{explanation}</p>
    </div>
  );
};

export default TestResult; 