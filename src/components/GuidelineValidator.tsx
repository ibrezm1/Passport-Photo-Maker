import React, { useState, useEffect } from 'react';
import { PhotoSize, PASSPORT_GUIDELINES_35x45, PASSPORT_GUIDELINES_51x51, SIGNATURE_GUIDELINES } from '@/src/constants';
import { CheckCircle2, AlertCircle, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AIValidatorProps {
  image: string;
  size: PhotoSize;
  theme: 'dark' | 'light';
  onValidationComplete: (passed: boolean) => void;
}

export const GuidelineValidator: React.FC<AIValidatorProps> = ({ image, size, theme, onValidationComplete }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [metadata, setMetadata] = useState<{ width: number; height: number } | null>(null);

  const guidelines = size === 'signature' 
    ? SIGNATURE_GUIDELINES 
    : size === '51x51' 
      ? PASSPORT_GUIDELINES_51x51 
      : PASSPORT_GUIDELINES_35x45;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMetadata({ width: img.width, height: img.height });
    };
    img.src = image;
  }, [image]);

  const toggleItem = (index: number) => {
    const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newChecked);
    
    // Check if all essential items are checked
    const allChecked = guidelines.every((_, i) => newChecked[i]);
    onValidationComplete(allChecked);
  };

  const allChecked = guidelines.every((_, i) => checkedItems[i]);

  return (
    <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-6 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Guideline Verification</h3>
        </div>
        {metadata && (
          <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
            {metadata.width}x{metadata.height} PX
          </div>
        )}
      </div>

      <div className={cn(
        "p-4 rounded-xl flex items-start gap-3 transition-colors duration-300",
        theme === 'dark' ? "bg-blue-500/5 border border-blue-500/10" : "bg-blue-50 border border-blue-100"
      )}>
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className={cn(
          "text-xs leading-relaxed transition-colors duration-300",
          theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
        )}>
          Please manually verify that your photo meets the following official requirements. All items must be checked to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {guidelines.map((guideline, index) => (
          <button
            key={index}
            onClick={() => toggleItem(index)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border transition-all text-left group",
              checkedItems[index] 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100" 
                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
              checkedItems[index] 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400 dark:group-hover:border-neutral-500"
            )}>
              {checkedItems[index] && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <span className="text-sm leading-snug">{guideline}</span>
          </button>
        ))}
      </div>

      {allChecked ? (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <ClipboardCheck className="w-5 h-5" />
          <span className="text-sm font-medium">All guidelines verified. You can now proceed.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              const allCheckedMap: Record<number, boolean> = {};
              guidelines.forEach((_, i) => (allCheckedMap[i] = true));
              setCheckedItems(allCheckedMap);
              onValidationComplete(true);
            }}
            className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Select All Guidelines
          </button>
          <div className="text-center">
            <p className="text-xs text-neutral-500">
              {Object.values(checkedItems).filter(Boolean).length} of {guidelines.length} verified
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
