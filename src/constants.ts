export type PhotoSize = '51x51' | '35x45' | 'signature';

export interface PhotoGuidelines {
  size: PhotoSize;
  widthMm: number;
  heightMm: number;
  facePercentageMin: number;
  facePercentageMax: number;
  description: string;
}

export const PHOTO_CONFIGS: Record<PhotoSize, PhotoGuidelines> = {
  '51x51': {
    size: '51x51',
    widthMm: 51,
    heightMm: 51,
    facePercentageMin: 50,
    facePercentageMax: 69,
    description: 'Standard (51x51 mm / 2x2 inch) / 600 x 600 px (Digital)',
  },
  '35x45': {
    size: '35x45',
    widthMm: 35,
    heightMm: 45,
    facePercentageMin: 80,
    facePercentageMax: 85,
    description: 'International Standard (35x45 mm)',
  },
  'signature': {
    size: 'signature',
    widthMm: 63, // 630px at 10px/mm
    heightMm: 30, // 300px at 10px/mm
    facePercentageMin: 0,
    facePercentageMax: 100,
    description: 'Digital Signature / Thumbprint (630x300 px)',
  },
};

export const PASSPORT_GUIDELINES_BASE = [
  "Uniform lighting, no shadows or flash reflections on the face, and no red eye.",
  "Mouth must be closed (not open).",
  "Taken from a distance of approximately 1.5 meters (not too close).",
  "Image must be sharp and not blurred.",
  "Full face, front view, eyes open and clearly visible.",
  "Full head from top of hair to bottom of chin must be present.",
  "Center head within frame; head should not be tilted.",
  "No distracting shadows on the face or background.",
  "No reflections on glasses (it is recommended to take glasses off).",
  "No red-eye effects or other effects reducing eye visibility.",
  "Head coverings only for religious reasons (face from chin to forehead must be fully visible).",
  "Natural facial expression.",
  "Background: Plain White.",
];

export const PASSPORT_GUIDELINES_35x45 = [
  ...PASSPORT_GUIDELINES_BASE,
  "Dimensions: 35 x 45 mm (Physical) / 630 x 810 px (Digital)."
];

export const PASSPORT_GUIDELINES_51x51 = [
  ...PASSPORT_GUIDELINES_BASE,
  "Dimensions: 51 x 51 mm (2 x 2 inch) (Physical) / 600 x 600 px (Digital)."
];

export const SIGNATURE_GUIDELINES = [
  "Signature or thumbprint must be clear and legible.",
  "Background must be plain white paper.",
  "No shadows or ink smudges around the signature.",
  "Signature must be centered within the frame.",
  "High contrast between ink and background.",
  "Dimensions: 630 x 300 pixels.",
  "File size: Under 100 KB."
];
