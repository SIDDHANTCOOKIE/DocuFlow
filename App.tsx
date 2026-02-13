import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, RefreshCw, FileText } from 'lucide-react';
import saveAs from 'file-saver';
import SegmentedControl from './components/SegmentedControl';
import Dropzone from './components/Dropzone';
import { ConversionMode, FileData } from './types';
import { convertDocxToMd, convertMdToDocx } from './utils/converter';

const App: React.FC = () => {
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.MD_TO_DOCX);
  const [file, setFile] = useState<FileData | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string } | null>(null);

  // Reset state when mode changes
  useEffect(() => {
    setFile(null);
    setResult(null);
    setIsConverting(false);
  }, [mode]);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    // Artificial delay for better UX (so the user sees the loading state)
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      if (mode === ConversionMode.MD_TO_DOCX) {
        // Input is text (string), Output is DOCX (Blob)
        const blob = await convertMdToDocx(file.content as string);
        const newName = file.name.replace(/\.md$/i, '') + '.docx';
        setResult({ blob, name: newName });
      } else {
        // Input is ArrayBuffer, Output is MD (String -> Blob)
        const mdString = await convertDocxToMd(file.content as ArrayBuffer);
        const blob = new Blob([mdString], { type: 'text/markdown;charset=utf-8' });
        const newName = file.name.replace(/\.docx$/i, '') + '.md';
        setResult({ blob, name: newName });
      }
    } catch (error) {
      console.error("Conversion failed", error);
      alert("An error occurred during conversion. Please check the file and try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      saveAs(result.blob, result.name);
    }
  };

  const acceptedExts = mode === ConversionMode.MD_TO_DOCX ? ['.md', '.txt'] : ['.docx'];

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <FileText className="w-6 h-6 text-gray-800" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">DocuFlow</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Convert your documents instantly. Secure, client-side, and beautifully simple.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
        
        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <SegmentedControl mode={mode} setMode={setMode} />
        </div>

        {/* Dropzone */}
        <div className="mb-8">
           <Dropzone 
             onFileSelected={setFile} 
             acceptedExtensions={acceptedExts}
           />
        </div>

        {/* Action Area */}
        <div className="space-y-4">
          {!result ? (
            <button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className={`w-full py-4 rounded-xl text-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform
                ${!file 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : isConverting 
                    ? 'bg-gray-900 text-white cursor-wait scale-[0.99]' 
                    : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg active:scale-[0.98]'
                }`}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>Convert File</span>
                  <ArrowRight className="w-5 h-5 opacity-80" />
                </>
              )}
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <button
                onClick={handleDownload}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Download {result.name}</span>
              </button>
              
              <button
                onClick={() => {
                   setFile(null);
                   setResult(null);
                }}
                className="w-full mt-4 py-3 bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl text-sm font-medium transition-colors"
              >
                Convert another file
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>Processed locally in your browser. No data leaves your device.</p>
      </div>

    </div>
  );
};

export default App;