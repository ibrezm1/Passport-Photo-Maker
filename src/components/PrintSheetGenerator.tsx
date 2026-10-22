import React from 'react';
import { PhotoSize, PHOTO_CONFIGS } from '@/src/constants';
import { Printer, Download, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PrintSheetGeneratorProps {
  croppedImage: string;
  size: PhotoSize;
  theme: 'dark' | 'light';
}

export const PrintSheetGenerator: React.FC<PrintSheetGeneratorProps> = ({ croppedImage, size, theme }) => {
  const config = PHOTO_CONFIGS[size];

  const generateSheet = async (sheetType: 'A4' | '4x6') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpi = 300;
    const pxPerMm = dpi / 25.4;

    if (sheetType === 'A4') {
      canvas.width = 210 * pxPerMm;
      canvas.height = 297 * pxPerMm;
    } else {
      // 6x4 inches (Landscape) = 152.4 x 101.6 mm
      canvas.width = 152.4 * pxPerMm;
      canvas.height = 101.6 * pxPerMm;
    }

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = croppedImage;
    await new Promise((resolve) => (img.onload = resolve));

    const photoWidthPx = config.widthMm * pxPerMm;
    const photoHeightPx = config.heightMm * pxPerMm;
    const marginPx = 3 * pxPerMm;
    const gapPx = 1 * pxPerMm;

    const cols = Math.floor((canvas.width - 2 * marginPx) / (photoWidthPx + gapPx));
    const rows = Math.floor((canvas.height - 2 * marginPx) / (photoHeightPx + gapPx));

    // Draw grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginPx + c * (photoWidthPx + gapPx);
        const y = marginPx + r * (photoHeightPx + gapPx);

        // Draw dotted border for cutting
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Dotted line
        ctx.strokeRect(x - 0.5, y - 0.5, photoWidthPx + 1, photoHeightPx + 1);
        ctx.setLineDash([]); // Reset dash

        // Draw image
        ctx.drawImage(img, x, y, photoWidthPx, photoHeightPx);
      }
    }

    const link = document.createElement('a');
    const displayType = sheetType === '4x6' ? '6x4' : sheetType;
    link.download = `passport_sheet_${displayType}_${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSingle = () => {
    const link = document.createElement('a');
    link.download = `passport_photo_${size}.jpg`;
    link.href = croppedImage;
    link.click();
  };

  const downloadDigital = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isSignature = size === 'signature';
    const is51x51 = size === '51x51';
    
    if (isSignature) {
      canvas.width = 630;
      canvas.height = 300;
    } else if (is51x51) {
      canvas.width = 600;
      canvas.height = 600;
    } else {
      // Default 35x45mm -> 630x810px
      canvas.width = 630;
      canvas.height = 810;
    }

    const img = new Image();
    img.src = croppedImage;
    await new Promise((resolve) => (img.onload = resolve));

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Use toBlob to control quality and check file size
    const maxSizeKB = isSignature ? 100 : 250;
    let quality = 0.9;
    
    const download = (b: Blob) => {
      const url = URL.createObjectURL(b);
      const link = document.createElement('a');
      link.download = isSignature ? `signature_digital_630x300.jpg` : `passport_digital_630x810.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      if (blob.size > maxSizeKB * 1024) {
        canvas.toBlob((smallerBlob) => {
          if (smallerBlob) download(smallerBlob);
        }, 'image/jpeg', 0.7);
      } else {
        download(blob);
      }
    }, 'image/jpeg', quality);
  };

  if (size === 'signature') {
    return (
      <div className="space-y-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">Signature Ready</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Your signature/thumbprint has been processed and is ready for download.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={downloadDigital}
            className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            <Download className="w-5 h-5" />
            Download Signature (630x300px, &lt;100KB)
          </button>
        </div>

        <div className={cn(
          "p-4 rounded-xl flex items-start gap-3 transition-colors duration-300",
          theme === 'dark' ? "bg-blue-500/5 border border-blue-500/10" : "bg-blue-50 border border-blue-100"
        )}>
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className={cn(
              "text-xs leading-relaxed transition-colors duration-300",
              theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
            )}>
              <strong>Digital Requirement:</strong> Exactly 630 x 300 pixels, JPEG format, under 100 KB.
            </p>
            <p className={cn(
              "text-xs leading-relaxed transition-colors duration-300",
              theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
            )}>
              The image has been optimized to ensure high contrast and clarity for official documentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={downloadSingle}
        className="flex items-center justify-center gap-2 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white font-medium rounded-xl transition-all border border-neutral-200 dark:border-neutral-700"
      >
        <Download className="w-5 h-5" />
        Download Original Size
      </button>
      <button
        onClick={downloadDigital}
        className="flex items-center justify-center gap-2 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white font-medium rounded-xl transition-all border border-neutral-200 dark:border-neutral-700"
      >
        <FileText className="w-5 h-5" />
        Download Digital ({size === '51x51' ? '600x600px' : '630x810px'})
      </button>
      <button
        onClick={() => generateSheet('A4')}
        className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-900/20"
      >
        <Printer className="w-5 h-5" />
        Generate A4 Sheet
      </button>
      <button
        onClick={() => generateSheet('4x6')}
        className="flex items-center justify-center gap-2 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white font-medium rounded-xl transition-all border border-neutral-200 dark:border-neutral-700"
      >
        <Printer className="w-5 h-5" />
        Generate 6x4 Print
      </button>
      <div className={cn(
        "sm:col-span-2 p-4 rounded-xl flex items-start gap-3 transition-colors duration-300",
        theme === 'dark' ? "bg-blue-500/5 border border-blue-500/10" : "bg-blue-50 border border-blue-100"
      )}>
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className={cn(
            "text-xs leading-relaxed transition-colors duration-300",
            theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
          )}>
            <strong>Digital Requirement:</strong> {size === '51x51' ? '600 x 600 pixels' : '630 x 810 pixels'}, JPG/JPEG format, under 250 KB.
          </p>
          <p className={cn(
            "text-xs leading-relaxed transition-colors duration-300",
            theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
          )}>
            <strong>Physical Requirement:</strong> {size === '51x51' ? '51 x 51 mm (2 x 2 inch)' : '35 x 45 mm (4.5 cm x 3.5 cm)'}.
          </p>
          <p className={cn(
            "text-xs leading-relaxed transition-colors duration-300",
            theme === 'dark' ? "text-neutral-400" : "text-blue-900/80"
          )}>
            Sheets are generated at 300 DPI. Ensure your printer settings are set to "Actual Size" (100% scale) for accurate dimensions. Dotted lines are provided for precise cutting.
          </p>
        </div>
      </div>
    </div>
  );
};
