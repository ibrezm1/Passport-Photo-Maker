import React, { useState } from 'react';
import { Bot, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PhotoSize, PASSPORT_GUIDELINES_35x45, PASSPORT_GUIDELINES_51x51, SIGNATURE_GUIDELINES } from '@/src/constants';

interface AIPromptValidatorProps {
  mode: 'photo' | 'signature';
  theme: 'dark' | 'light';
  size: PhotoSize;
}

export const AIPromptValidator: React.FC<AIPromptValidatorProps> = ({ mode, theme, size }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const guidelines = mode === 'photo' 
    ? (size === '51x51' ? PASSPORT_GUIDELINES_51x51 : PASSPORT_GUIDELINES_35x45)
    : SIGNATURE_GUIDELINES;
  
  const promptText = `Please analyze the attached image for an Indian ${mode === 'photo' ? 'Passport Photo' : 'Signature/Thumbprint'} application. Evaluate it strictly against the following official guidelines and technical requirements:

${guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}
${mode === 'photo' ? `${guidelines.length + 1}. Technical Requirements: JPEG format, exactly ${size === '51x51' ? '600 x 600' : '630 x 810'} pixels, and under 250 KB in size.` : ''}

Please format your response EXACTLY as a Markdown table with the following columns: 
- "Criteria Name" (Include a relevant emoji/icon for each criteria)
- "Status" (Use ✅ PASS, ❌ FAIL, or ⚠️ WARNING)
- "Reason" (A brief explanation of why it passed or failed)

Note: For technical requirements (exact file size, exact pixel count, and file format) that cannot be 100% verified through image upload compression, mark them as ⚠️ WARNING and advise manual checking.

Below the table, include:
- 🟢/🔴/🟡 **FINAL VERDICT:** [READY TO SUBMIT / NEEDS ADJUSTMENT / PENDING TECHNICAL CHECK]
- 💡 **SUGGESTED IMPROVEMENTS:** [List any necessary fixes or manual checks needed]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full px-6 py-4 flex items-center justify-between transition-colors",
          theme === 'dark' ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
        )}
      >
        <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-bold">
          <Bot className="w-5 h-5" />
          AI Validation Prompt (Gemini/ChatGPT)
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-neutral-800/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Copy this expert-crafted prompt and paste it into Gemini, ChatGPT, or any AI along with your uploaded images to get a professional second opinion on your photo's compliance.
          </p>
          
          <div className="relative group">
            <pre className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl text-[10px] font-mono text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap border border-neutral-200 dark:border-neutral-800 max-h-[150px] overflow-y-auto custom-scrollbar">
              {promptText}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Prompt Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </button>
            <a 
              href="https://gemini.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white rounded-xl transition-all border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Open Gemini
            </a>
          </div>

          <div className={cn(
            "flex items-center gap-2 p-3 rounded-xl border transition-colors duration-300",
            theme === 'dark' ? "bg-purple-500/5 border-purple-500/10" : "bg-purple-50 border-purple-100"
          )}>
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <p className={cn(
              "text-[10px] italic transition-colors duration-300",
              theme === 'dark' ? "text-purple-300/70" : "text-purple-700/80"
            )}>
              Tip: Upload both your original photo and the cropped version for the most accurate AI analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
