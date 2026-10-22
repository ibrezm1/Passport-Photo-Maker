import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { cn } from '@/src/lib/utils';
import { PhotoSize, PHOTO_CONFIGS } from '@/src/constants';

interface PhotoEditorProps {
  image: string;
  size: PhotoSize;
  onCropComplete: (croppedImage: string) => void;
  brightness: number;
  contrast: number;
  setBrightness: (val: number) => void;
  setContrast: (val: number) => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  image,
  size,
  onCropComplete,
  brightness,
  contrast,
  setBrightness,
  setContrast
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const config = PHOTO_CONFIGS[size];
  const aspect = config.widthMm / config.heightMm;

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return;
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const base64Image = canvas.toDataURL('image/jpeg');
      onCropComplete(base64Image);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative w-full h-[450px] bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-inner transition-colors duration-300">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
          showGrid={false}
          style={{
            mediaStyle: {
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }
          }}
          classes={{
            containerClassName: "bg-neutral-200 dark:bg-neutral-950",
            mediaClassName: "max-w-none",
            cropAreaClassName: "border-2 border-blue-500/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]",
          }}
        />
        
        {/* Guardrails Overlay - Centered within the crop area */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           {size === 'signature' ? (
             <div 
               className="border-2 border-red-600/60 border-dashed rounded-lg flex items-center justify-center"
               style={{
                 width: '80%',
                 height: '60%',
                 aspectRatio: aspect.toString(),
               }}
             >
               {/* Baseline for signature */}
               <div className="absolute bottom-[20%] left-[10%] right-[10%] border-t-2 border-red-500/30" />
             </div>
           ) : (
             <div 
               className="border-2 border-red-600/60 border-dashed rounded-[50%_50%_45%_45%] flex items-center justify-center"
               style={{
                 // Adjusted to be even smaller to help users hit the 80-85% face coverage target
                 height: '45%', 
                 aspectRatio: aspect.toString(),
                 marginTop: '-2%'
               }}
             >
               {/* Inner guides for eyes and chin */}
               <div className="absolute top-[35%] left-0 w-full border-t border-red-500/30" />
               <div className="absolute top-[50%] left-0 w-full border-t border-red-500/30" />
               <div className="absolute bottom-[15%] left-0 w-full border-t border-red-500/30" />
             </div>
           )}
           
           <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-red-500/20">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
             {size === 'signature' ? 'Signature / Thumb Alignment' : '80-85% Face Coverage Guide'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors">Brightness ({brightness}%)</label>
          <input
            type="range"
            min={50}
            max={150}
            step={1}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors">Contrast ({contrast}%)</label>
          <input
            type="range"
            min={50}
            max={150}
            step={1}
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={getCroppedImg}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
          >
            Apply & Validate
          </button>
        </div>
      </div>
    </div>
  );
};
