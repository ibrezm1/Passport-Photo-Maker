import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Download,
  Image as ImageIcon,
  User,
  Scissors,
  ShieldCheck,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import { PhotoEditor } from './components/PhotoEditor';
import { GuidelineValidator } from './components/GuidelineValidator';
import { PrintSheetGenerator } from './components/PrintSheetGenerator';
import { ImageInspector } from './components/ImageInspector';
import { AIPromptValidator } from './components/AIPromptValidator';
import sampleGuide from './assets/sample_guide.png';
import { PhotoSize, PHOTO_CONFIGS, PASSPORT_GUIDELINES_BASE, SIGNATURE_GUIDELINES } from './constants';
import { cn } from './lib/utils';

type Step = 'upload' | 'edit' | 'validate' | 'download';
type AppMode = 'photo' | 'signature';

export default function App() {
  const [mode, setMode] = useState<AppMode>('photo');
  const [step, setStep] = useState<Step>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [size, setSize] = useState<PhotoSize>('35x45');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isValidated, setIsValidated] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setStep('edit');
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const reset = () => {
    setImage(null);
    setCroppedImage(null);
    setStep('upload');
    setIsValidated(false);
    setBrightness(100);
    setContrast(100);
  };

  const toggleMode = (newMode: AppMode) => {
    setMode(newMode);
    setSize(newMode === 'photo' ? '35x45' : 'signature');
    reset();
  };

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300",
      theme === 'dark' ? "bg-neutral-950 text-neutral-100 dark" : "bg-neutral-50 text-neutral-900"
    )}>
      {/* Header */}
      <header className={cn(
        "border-b sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300",
        theme === 'dark' ? "border-neutral-800 bg-neutral-950/50" : "border-neutral-200 bg-white/80"
      )}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PassportPhoto<span className="text-blue-500">AI</span></h1>
          </div>
          
          <div className={cn(
            "hidden md:flex p-1 rounded-xl border transition-colors duration-300",
            theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-neutral-100 border-neutral-200"
          )}>
            <button
              onClick={() => toggleMode('photo')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
                mode === 'photo' 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : theme === 'dark' ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <User className="w-4 h-4" />
              Passport Photo
            </button>
            <button
              onClick={() => toggleMode('signature')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
                mode === 'signature' 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : theme === 'dark' ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <FileText className="w-4 h-4" />
              Signature / Thumb
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-xl border transition-all duration-300",
                theme === 'dark' 
                  ? "bg-neutral-900 border-neutral-800 text-yellow-400 hover:bg-neutral-800" 
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 shadow-sm"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={reset}
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-2",
                theme === 'dark' ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'edit', label: 'Crop & Adjust', icon: Scissors },
              { id: 'validate', label: 'Verify', icon: ShieldCheck },
              { id: 'download', label: 'Print', icon: CheckCircle2 },
            ].map((s, i, arr) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    step === s.id ? "bg-blue-600 text-white ring-4 ring-blue-500/20" : 
                    arr.findIndex(x => x.id === step) > i ? "bg-emerald-500 text-white" : 
                    theme === 'dark' ? "bg-neutral-800 text-neutral-500" : "bg-neutral-200 text-neutral-400"
                  )}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    step === s.id ? "text-blue-400" : 
                    theme === 'dark' ? "text-neutral-500" : "text-neutral-400"
                  )}>{s.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={cn(
                    "w-8 md:w-16 h-px mt-[-20px] transition-colors duration-300",
                    theme === 'dark' ? "bg-neutral-800" : "bg-neutral-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className={cn(
                    "border rounded-3xl overflow-hidden transition-colors duration-300",
                    theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                  )}>
                    <button 
                      onClick={() => setShowGuidelines(!showGuidelines)}
                      className={cn(
                        "w-full px-6 py-4 flex items-center justify-between transition-colors",
                        theme === 'dark' ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex items-center gap-3 text-blue-400 font-bold">
                        <ShieldCheck className="w-5 h-5" />
                        Official Guidelines
                      </div>
                      {showGuidelines ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
                    </button>
                    
                    <AnimatePresence>
                      {showGuidelines && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={cn(
                            "px-6 pb-6 pt-2 border-t transition-colors duration-300",
                            theme === 'dark' ? "border-neutral-800/50" : "border-neutral-100"
                          )}>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                              {(mode === 'photo' ? PASSPORT_GUIDELINES_BASE : SIGNATURE_GUIDELINES).map((rule, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                  <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                                  <span className={cn(
                                    "leading-snug transition-colors duration-300",
                                    theme === 'dark' ? "text-neutral-300" : "text-neutral-600"
                                  )}>{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className={cn(
                    "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center group transition-all duration-500",
                    theme === 'dark' 
                      ? "bg-neutral-900 border-neutral-800 hover:border-blue-500/50" 
                      : "bg-white border-neutral-200 hover:border-blue-500/50 shadow-sm"
                  )}>
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500",
                      theme === 'dark' ? "bg-neutral-800" : "bg-neutral-100"
                    )}>
                      <ImageIcon className="w-10 h-10 text-neutral-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Upload {mode === 'photo' ? 'your photo' : 'signature/thumbprint'}</h2>
                    <p className={cn(
                      "mb-8 max-w-sm transition-colors duration-300",
                      theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                    )}>
                      {mode === 'photo' 
                        ? 'Select a high-quality portrait. Ensure the background is plain and lighting is even.'
                        : 'Upload a clear scan or photo of the signature or thumbprint on plain white paper.'}
                    </p>
                    <label className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl cursor-pointer transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                      Choose Image
                      <input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={cn(
                      "p-6 border rounded-2xl space-y-2 transition-colors duration-300",
                      theme === 'dark' ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                    )}>
                      <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                        <User className="w-4 h-4" />
                        Minor Guidelines
                      </div>
                      <p className={cn(
                        "text-sm transition-colors duration-300",
                        theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                      )}>Special rules apply for children under 4 years old. Face must take up 80-85% of the frame.</p>
                    </div>
                    <div className={cn(
                      "p-6 border rounded-2xl space-y-2 transition-colors duration-300",
                      theme === 'dark' ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                    )}>
                      <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                        <ImageIcon className="w-4 h-4" />
                        Quality Check
                      </div>
                      <p className={cn(
                        "text-sm transition-colors duration-300",
                        theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                      )}>Use a high-resolution photo. Avoid selfies; have someone else take the photo for better results.</p>
                    </div>
                  </div>

                  {/* Seattle Jurisdiction Notice */}
                  <div className={cn(
                    "p-6 border rounded-2xl space-y-3 transition-colors duration-300",
                    theme === 'dark' ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-center gap-2 text-amber-500 font-bold">
                      <AlertCircle className="w-5 h-5" />
                      Seattle Jurisdiction Notice
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed transition-colors duration-300",
                      theme === 'dark' ? "text-neutral-300" : "text-amber-900/80"
                    )}>
                      All applicants applying for Indian Visa services under the jurisdiction of the Consulate General of India, Seattle, are requested to verify that their existing or previous login credentials are correctly mapped to the Seattle jurisdiction. If your login credentials are not mapped, please create a new username and password to ensure that the Government of India Form reflects the Consulate General of India, Seattle, as your Consulate.
                    </p>
                  </div>

                  {mode === 'photo' && <ImageInspector theme={theme} />}
                </motion.div>
              )}

              {step === 'edit' && image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Crop & Adjust</h2>
                    {mode === 'photo' && (
                      <div className={cn(
                        "flex p-1 rounded-xl border transition-colors duration-300",
                        theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-neutral-100 border-neutral-200"
                      )}>
                        {(['35x45', '51x51'] as PhotoSize[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={cn(
                              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                              size === s 
                                ? "bg-blue-600 text-white shadow-lg" 
                                : theme === 'dark' ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
                            )}
                          >
                            {PHOTO_CONFIGS[s].size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <PhotoEditor 
                    image={image} 
                    size={size} 
                    brightness={brightness}
                    contrast={contrast}
                    setBrightness={setBrightness}
                    setContrast={setContrast}
                    onCropComplete={(cropped) => {
                      setCroppedImage(cropped);
                      setStep('validate');
                    }} 
                  />
                </motion.div>
              )}

              {step === 'validate' && croppedImage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <div className={cn(
                        "absolute -inset-4 rounded-3xl blur-2xl transition-all",
                        theme === 'dark' ? "bg-blue-500/20 group-hover:bg-blue-500/30" : "bg-blue-500/10 group-hover:bg-blue-500/20"
                      )} />
                      <img 
                        src={croppedImage} 
                        alt="Cropped" 
                        className={cn(
                          "relative w-64 h-auto rounded-2xl shadow-2xl border-4 transition-colors duration-300",
                          theme === 'dark' ? "border-neutral-800" : "border-white"
                        )}
                      />
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = croppedImage;
                          link.download = `passport_photo_${Date.now()}.jpg`;
                          link.click();
                        }}
                        className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
                        title="Download for AI Validation"
                      >
                        <Download className="w-4 h-4" />
                        Download for AI
                      </button>
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Validation & Review</h2>
                      <p className={cn(
                        "transition-colors duration-300",
                        theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        {mode === 'photo' 
                          ? 'Please verify if your photo meets official requirements.'
                          : 'Please verify if the signature/thumbprint is clear and well-positioned.'}
                      </p>
                    </div>
                  </div>

                  <GuidelineValidator 
                    image={croppedImage} 
                    size={size}
                    theme={theme}
                    onValidationComplete={(passed) => {
                      setIsValidated(passed);
                    }} 
                  />

                  <AIPromptValidator mode={mode} theme={theme} size={size} />

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('edit')}
                      className={cn(
                        "flex-1 py-4 font-semibold rounded-2xl transition-all border",
                        theme === 'dark' 
                          ? "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700" 
                          : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200 shadow-sm"
                      )}
                    >
                      Back to Edit
                    </button>
                    <button
                      onClick={() => setStep('download')}
                      disabled={!isValidated}
                      className={cn(
                        "flex-1 py-4 font-semibold rounded-2xl transition-all shadow-xl",
                        isValidated 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20" 
                          : theme === 'dark' ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      )}
                    >
                      {mode === 'photo' ? 'Continue to Print' : 'Continue to Download'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'download' && croppedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className={cn(
                    "border p-6 rounded-2xl flex items-center gap-4 transition-colors duration-300",
                    theme === 'dark' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                  )}>
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">Ready for Printing</h3>
                      <p className={cn(
                        "text-sm transition-colors duration-300",
                        theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                      )}>Your photo has been validated and is ready for download or printing.</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6">
                    <img 
                      src={croppedImage} 
                      alt="Final" 
                      className={cn(
                        "w-48 h-auto rounded-xl shadow-xl border-2 transition-colors duration-300",
                        theme === 'dark' ? "border-neutral-800" : "border-white"
                      )}
                    />
                  </div>

                  <PrintSheetGenerator croppedImage={croppedImage} size={size} theme={theme} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            {step === 'upload' && mode === 'photo' && (
              <>
                <div className={cn(
                  "border rounded-3xl p-6 transition-colors duration-300",
                  theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                )}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                      <ImageIcon className="w-5 h-5" />
                      Reference Guide
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed mb-4 transition-colors duration-300",
                      theme === 'dark' ? "text-neutral-400" : "text-neutral-500"
                    )}>
                      Click below to view the official Indian Passport photo specifications and samples.
                    </p>
                    <div 
                      className={cn(
                        "relative aspect-[35/45] rounded-xl overflow-hidden border cursor-pointer group mb-4 transition-colors duration-300",
                        theme === 'dark' ? "bg-neutral-800 border-neutral-700" : "bg-neutral-100 border-neutral-200"
                      )}
                      onClick={() => window.open(sampleGuide, '_blank')}
                    >
                      <img 
                        src={sampleGuide} 
                        alt="Sample Guide" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(sampleGuide, '_blank')}
                      className={cn(
                        "w-full py-3 text-sm font-medium rounded-xl border transition-all flex items-center justify-center gap-2",
                        theme === 'dark' 
                          ? "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700" 
                          : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200 shadow-sm"
                      )}
                    >
                      <ImageIcon className="w-4 h-4" />
                      View Full Guide
                    </button>
                  </div>
                </div>
                
                <div className={cn(
                  "border rounded-3xl p-6 space-y-6 transition-colors duration-300",
                  theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                )}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Scissors className="w-5 h-5" />
                      Help Photo Edits
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'Image Resizer', url: 'https://imageresizer.com/crop-image' },
                        { name: 'Passport Photo Editor', url: 'https://passportphotoeditor.com/' },
                        { name: 'Photo Prints Now', url: 'https://www.photoprintsnow.com/' },
                        { name: 'Make Passport Photo', url: 'https://makepassportphoto.com/en/p/editphoto' },
                      ].map((link) => (
                        <a 
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all group",
                            theme === 'dark' 
                              ? "bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/50 hover:border-blue-500/30" 
                              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-100 hover:border-blue-500/30 shadow-sm"
                          )}
                        >
                          <span className={cn(
                            "text-xs transition-colors",
                            theme === 'dark' ? "text-neutral-300 group-hover:text-white" : "text-neutral-600 group-hover:text-neutral-900"
                          )}>{link.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-blue-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <ShieldCheck className="w-5 h-5" />
                      Official Reference
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'Minor Passport Reissue Guide', url: 'https://www.path2usa.com/nri/indian-passport-services/reissue-renewal-of-indian-passport-for-minors' },
                        { name: 'VFS Global Official Site', url: 'https://www.vfsglobal.com/en/individuals/index.html' },
                        { name: 'Minor Photo Guidelines (PDF)', url: 'https://passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf' },
                        { name: 'Application Instruction Booklet (PDF)', url: 'https://mportal.passportindia.gov.in/pdf/ApplicationformInstructionBooklet-V3.0.pdf' },
                      ].map((link) => (
                        <a 
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all group",
                            theme === 'dark' 
                              ? "bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/50 hover:border-blue-500/30" 
                              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-100 hover:border-blue-500/30 shadow-sm"
                          )}
                        >
                          <span className={cn(
                            "text-xs transition-colors truncate pr-2",
                            theme === 'dark' ? "text-neutral-300 group-hover:text-white" : "text-neutral-600 group-hover:text-neutral-900"
                          )}>{link.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-blue-400 transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className={cn(
              "border rounded-3xl p-6 sticky top-24 transition-colors duration-300",
              theme === 'dark' ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
            )}>
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-6">
                <Info className="w-5 h-5" />
                {mode === 'photo' ? 'Official Guidelines' : 'Signature Guidelines'}
              </div>
              <ul className="space-y-4">
                {(mode === 'photo' ? PASSPORT_GUIDELINES_BASE : SIGNATURE_GUIDELINES).slice(0, 8).map((rule, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                    <span className={cn(
                      "leading-snug transition-colors duration-300",
                      theme === 'dark' ? "text-neutral-300" : "text-neutral-600"
                    )}>{rule}</span>
                  </li>
                ))}
              </ul>
              {mode === 'photo' && (
                <div className={cn(
                  "mt-8 p-4 border rounded-xl flex items-start gap-3 transition-colors duration-300",
                  theme === 'dark' ? "bg-amber-500/5 border-amber-500/10" : "bg-amber-50 border-amber-200"
                )}>
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className={cn(
                    "text-xs leading-relaxed transition-colors duration-300",
                    theme === 'dark' ? "text-neutral-400" : "text-amber-900/80"
                  )}>
                    For children under 4, minor head tilt or natural expressions are often accepted, but eyes must be open.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "mt-20 border-t py-12 transition-colors duration-300",
        theme === 'dark' ? "border-neutral-900 bg-neutral-950" : "border-neutral-200 bg-white"
      )}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm">
            &copy; 2026 PassportPhoto AI. Professional tools for official documentation.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
