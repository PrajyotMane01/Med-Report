import React from 'react';
import TestResult from './TestResult';

interface TestResultData {
  name: string;
  value: string;
  status: string;
  explanation: string;
}

interface TestResultsProps {
  testResults: TestResultData[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  if (!testResults || testResults.length === 0) return null;

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-lg font-medium text-gray-800">Test Results</h3>
        <span className="text-sm text-gray-500">
          {testResults.length} tests
        </span>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {testResults.map((test, index) => (
          <TestResult
            key={index}
            name={test.name}
            value={test.value}
            status={test.status}
            explanation={test.explanation}
          />
        ))}
      </div>
    </div>
  );
};

export default TestResults; 