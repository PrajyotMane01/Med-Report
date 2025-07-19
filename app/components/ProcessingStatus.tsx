import React from 'react';

interface ProcessingStatusProps {
  status: string;
  visible: boolean;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, visible }) => {
  if (!visible) return null;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#4cbe4c] border-t-transparent rounded-full animate-spin"></div>
        <div>
          <p className="text-sm font-medium text-gray-700">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus; 