import React, { useCallback, useState } from 'react';
import { Upload, FileText, File as FileIcon, X } from 'lucide-react';
import { FileData } from '../types';

interface DropzoneProps {
  onFileSelected: (file: FileData | null) => void;
  acceptedExtensions: string[];
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelected, acceptedExtensions }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedExtensions.includes(extension)) {
      alert(`Invalid file type. Please upload ${acceptedExtensions.join(' or ')}`);
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (content) {
        onFileSelected({
          name: file.name,
          content: content as ArrayBuffer | string, // Typing depends on readAs
          type: extension,
        });
      }
    };

    if (extension === '.docx') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, [acceptedExtensions, onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
    onFileSelected(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
        h-64 flex flex-col items-center justify-center text-center p-8 overflow-hidden`}
    >
      <input
        type="file"
        accept={acceptedExtensions.join(',')}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      <div className={`transition-all duration-300 ${selectedFileName ? 'scale-90 opacity-0 absolute' : 'opacity-100 scale-100'}`}>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:shadow-md transition-shadow">
          <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <p className="text-gray-900 font-medium text-lg mb-1">Drag & Drop your file</p>
        <p className="text-gray-500 text-sm">or click to browse</p>
        <p className="text-gray-400 text-xs mt-4 uppercase tracking-wider font-medium">{acceptedExtensions.join('  •  ')}</p>
      </div>

      {/* Success State */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white transition-all duration-300 ${selectedFileName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-green-500">
           {acceptedExtensions.includes('.md') ? <FileIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
        </div>
        <p className="text-gray-900 font-medium text-lg mb-1 max-w-[80%] truncate">{selectedFileName}</p>
        <p className="text-green-600 text-sm font-medium mb-6">Ready to convert</p>
        
        {/* We need a custom button here that isn't covered by the input, so we use z-20 and manage clicks */}
        <button 
          onClick={clearFile}
          className="z-20 flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 text-sm transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Remove file</span>
        </button>
      </div>
    </div>
  );
};

export default Dropzone;