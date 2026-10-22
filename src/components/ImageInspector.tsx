import React, { useState } from 'react';
import { FileSearch, Maximize2, HardDrive, Upload, ChevronDown, ChevronUp, Trash2, ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InspectedFile {
  id: string;
  name: string;
  size: string;
  width: number;
  height: number;
  preview: string;
  isExpanded: boolean;
}

interface ImageInspectorProps {
  theme: 'dark' | 'light';
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({ theme }) => {
  const [files, setFiles] = useState<InspectedFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newFile: InspectedFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            width: img.width,
            height: img.height,
            preview: event.target?.result as string,
            isExpanded: false,
          };
          setFiles((prev) => [newFile, ...prev]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    e.target.value = '';
  };

  const toggleExpand = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isExpanded: !f.isExpanded } : f))
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
          <FileSearch className="w-5 h-5" />
          Image Inspector
        </div>
        {files.length > 0 && (
          <span className="text-[10px] bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
            {files.length}
          </span>
        )}
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Upload images to check exact pixel dimensions and file size.
      </p>

      <label className={cn(
        "flex flex-col items-center justify-center w-full py-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group",
        theme === 'dark' 
          ? "bg-neutral-950/30 border-neutral-800 hover:border-blue-500/50" 
          : "bg-neutral-50 border-neutral-200 hover:border-blue-500/50"
      )}>
        <Upload className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-500 mb-1" />
        <span className={cn(
          "text-[10px] uppercase font-bold tracking-wider transition-colors",
          theme === 'dark' ? "text-neutral-500 group-hover:text-neutral-300" : "text-neutral-500 group-hover:text-neutral-700"
        )}>Inspect Images</span>
        <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
      </label>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {files.map((file) => (
          <div 
            key={file.id} 
            className={cn(
              "border rounded-2xl transition-all duration-300 overflow-hidden",
              file.isExpanded 
                ? "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700" 
                : "bg-white dark:bg-neutral-950/50 border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
            )}
          >
            {/* Collapsed Header */}
            <div 
              className="p-3 flex items-center justify-between cursor-pointer group"
              onClick={() => toggleExpand(file.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200 truncate max-w-[120px]">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] text-neutral-500 font-mono">
                    <span>{file.width}×{file.height}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <span>{file.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {file.isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>

            {/* Expanded Content */}
            {file.isExpanded && (
              <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <img src={file.preview} alt="Preview" className="w-full h-full object-contain" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                <div className={cn(
                  "p-2 rounded-xl border transition-colors duration-300",
                  theme === 'dark' ? "bg-neutral-900 border-neutral-700/50" : "bg-white border-neutral-100 shadow-sm"
                )}>
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span className="text-[8px] uppercase font-bold tracking-wider">Pixels</span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-900 dark:text-white">{file.width} × {file.height}</p>
                </div>
                <div className={cn(
                  "p-2 rounded-xl border transition-colors duration-300",
                  theme === 'dark' ? "bg-neutral-900 border-neutral-700/50" : "bg-white border-neutral-100 shadow-sm"
                )}>
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                    <HardDrive className="w-2.5 h-2.5" />
                    <span className="text-[8px] uppercase font-bold tracking-wider">Size</span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-900 dark:text-white">{file.size}</p>
                </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
