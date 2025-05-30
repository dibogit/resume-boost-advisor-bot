
import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

const FileUploadZone = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && isValidFile(file)) {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      onFileUpload(file);
    }
  };

  const isValidFile = (file) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
          isDragging ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Upload className={`h-6 w-6 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragging ? 'Drop your resume here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports TXT, PDF, DOC, DOCX files
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
