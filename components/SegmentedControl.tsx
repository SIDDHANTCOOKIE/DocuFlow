import React from 'react';
import { ConversionMode } from '../types';

interface SegmentedControlProps {
  mode: ConversionMode;
  setMode: (mode: ConversionMode) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ mode, setMode }) => {
  return (
    <div className="bg-gray-200/80 p-1 rounded-lg inline-flex relative shadow-inner backdrop-blur-md">
      {/* Sliding background for animation could be added here, but simple conditional classes work well for minimal code */}
      <button
        onClick={() => setMode(ConversionMode.MD_TO_DOCX)}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none ${
          mode === ConversionMode.MD_TO_DOCX
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Markdown → DOCX
      </button>
      <button
        onClick={() => setMode(ConversionMode.DOCX_TO_MD)}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none ${
          mode === ConversionMode.DOCX_TO_MD
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        DOCX → Markdown
      </button>
    </div>
  );
};

export default SegmentedControl;