import React from 'react';

interface PatientInfoProps {
  patientInfo: string;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patientInfo }) => {
  if (!patientInfo) return null;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Patient Information</h3>
      <div className="bg-[#f0f9f0] rounded-md p-3 border-l-2 border-[#4cbe4c]">
        <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
          {patientInfo.replace(/\*\*/g, '').replace(/##/g, '').replace(/\*/g, '')}
        </div>
      </div>
    </div>
  );
};

export default PatientInfo; 