import React, { useState, useEffect } from 'react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  onSubmit,
  loading,
  error
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-soft-lg animate-slide-up mb-8 md:mb-0">
      <form onSubmit={onSubmit} className="space-y-6">
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${dragActive 
              ? 'border-green-400 bg-green-50' 
              : file 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-green-300 hover:bg-green-50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileInputChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            {file ? (
              <div className="animate-fade-in space-y-4">
                {preview && (
                  <div className="relative max-w-md mx-auto">
                    <img 
                      src={preview} 
                      alt="Report preview" 
                      className="rounded-lg shadow-sm max-h-[300px] w-auto mx-auto"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <div>
                  <p className="text-green-600 font-medium">Selected: {file.name}</p>
                  <p className="text-sm text-gray-500">Ready to analyze</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mt-4">
                  Drop your medical report here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports JPG, PNG, PDF images
                </p>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!file || loading}
          className="
            w-full matt-green-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg
            transition-all duration-300 shadow-soft hover:shadow-soft-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-[1.02] active:scale-[0.98]
            flex items-center justify-center gap-3
          "
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Report...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Report
            </>
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload; 