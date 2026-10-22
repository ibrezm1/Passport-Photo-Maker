# PassportPhoto AI 📷

> A free, browser-based tool to create, crop, validate, and print **Indian Passport & Visa photos** that meet official government specifications — no uploads to any server, everything runs locally in your browser.

🌐 **Live App:** [https://ibrezm1.github.io/Passport-Photo-Maker/](https://ibrezm1.github.io/Passport-Photo-Maker/)

---

## What the App Does

PassportPhoto AI guides you through a 4-step workflow to produce a photo that complies with the official requirements set by the **Government of India** (Passport Seva / VFS Global). It handles both **passport/visa photos** and **signature/thumbprint** images for online visa applications.

### Supported Formats

| Format | Physical Size | Digital Size | Use Case |
|--------|--------------|--------------|----------|
| **35×45 mm** | 35 × 45 mm | 630 × 810 px | Indian Passport (International Standard) |
| **51×51 mm** | 51 × 51 mm (2×2 inch) | 600 × 600 px | US Visa / OCI |
| **Signature / Thumbprint** | — | 630 × 300 px | Online visa applications |

---

## How It Works — Step by Step

### Step 1 · Upload

- Click **Choose Image** and select any photo from your device.
- The app accepts any common image format (`image/*`).
- Before uploading, you can expand the **Official Guidelines** panel to review all government requirements at a glance.
- A **Seattle Jurisdiction Notice** is shown for applicants applying under the Consulate General of India, Seattle.

> **Mode switching:** Toggle between **Passport Photo** and **Signature / Thumb** mode using the header nav. Each mode has its own set of guidelines and crop dimensions.

---

### Step 2 · Crop & Adjust

The interactive crop editor (powered by [react-easy-crop](https://github.com/ValentinH/react-easy-crop)) lets you:

| Control | Description |
|---------|-------------|
| **Drag** | Pan the image within the crop frame |
| **Zoom slider** | Scale the image from 1× to 3× |
| **Brightness slider** | Adjust from 50% to 150% |
| **Contrast slider** | Adjust from 50% to 150% |

**Guardrails overlay** — a red dashed guide is rendered *inside* the crop area to help achieve correct face coverage:
- For **photos**: An oval guide targets the 80–85% face coverage requirement, with horizontal rules for eye-line, nose-line, and chin-line positioning.
- For **signatures**: A rectangular guide with a baseline rule helps center and align the signature/thumbprint.

Pressing **Apply & Validate** bakes the crop + brightness/contrast into a JPEG image via the HTML5 Canvas API and advances to Step 3.

---

### Step 3 · Validate & Review

The cropped image is displayed prominently. Two validators run side-by-side:

#### 🛡️ Guideline Verification (Manual Checklist)
A full interactive checklist of all official requirements specific to the selected size (35×45, 51×51, or Signature). You must tick every item to enable the **Continue to Print** button. A **Select All** shortcut is available.

Requirements checked include (for passport photos):
- Uniform lighting, no shadows or flash reflections
- Mouth closed, eyes open and clearly visible
- Full face front view, no tilt
- Plain white background
- No glasses reflections or red-eye
- Correct pixel dimensions

#### 🤖 AI Validation Prompt (Gemini / ChatGPT)
An expandable panel generates a ready-to-paste expert prompt. Copy it, open [Gemini](https://gemini.google.com/) or ChatGPT, upload your photo alongside the prompt, and receive a structured **Markdown table** evaluation with:
- Per-criteria **PASS / FAIL / WARNING** status
- A final verdict: `READY TO SUBMIT`, `NEEDS ADJUSTMENT`, or `PENDING TECHNICAL CHECK`
- Suggested improvements

> **Tip:** Download the photo using the hover button on the image preview, then upload both the original and cropped versions to the AI for the most thorough analysis.

---

### Step 4 · Download & Print

Multiple export options are available once validation is complete:

#### For Passport Photos
| Button | Output |
|--------|--------|
| **Download Original Size** | Cropped JPEG at the native crop resolution |
| **Download Digital** | Resized to exact government pixel spec (630×810 or 600×600 px), auto-compressed to stay under 250 KB |
| **Generate A4 Sheet** | 300 DPI PNG sheet tiled with as many photos as fit on an A4 page (210×297 mm), with dotted cut-lines |
| **Generate 6×4 Print** | 300 DPI PNG sheet tiled on a 6×4 inch (photo paper) layout, with dotted cut-lines |

> Print sheets at **"Actual Size" (100% scale)** in your printer settings for accurate physical dimensions.

#### For Signatures / Thumbprints
| Button | Output |
|--------|--------|
| **Download Signature** | JPEG at exactly 630×300 px, auto-compressed to stay under 100 KB |

---

## Bonus Tool — Image Inspector

Available on the upload screen, the **Image Inspector** lets you drag-and-drop or select multiple images to instantly check their:
- **Pixel dimensions** (width × height)
- **File size** (in KB)

This is useful for verifying that an existing photo or digital scan already meets the government's pixel-dimension requirements before you use it.

---

## Official Guidelines Summary

The app enforces the following requirements from the Government of India:

- ✅ Plain **white background** only
- ✅ Full face, **front-facing**, eyes open
- ✅ Head must not be tilted; centered in frame
- ✅ **Mouth closed**, natural expression
- ✅ No shadows on face or background
- ✅ No glasses (recommended), no red-eye
- ✅ Head coverings only for religious reasons (full face chin-to-forehead visible)
- ✅ Photo taken from ~1.5 m distance
- ✅ Sharp, high-resolution, no blur
- ✅ **Face coverage: 80–85%** of frame (35×45 mm format)
- ✅ **Face coverage: 50–69%** of frame (51×51 mm format)
- ✅ Children under 4: natural expression allowed, eyes must be open

**Reference documents:**
- [VFS Global Official Site](https://www.vfsglobal.com/en/individuals/index.html)
- [Minor Photo Guidelines (PDF)](https://passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf)
- [Application Instruction Booklet (PDF)](https://mportal.passportindia.gov.in/pdf/ApplicationformInstructionBooklet-V3.0.pdf)
- [Minor Passport Reissue Guide](https://www.path2usa.com/nri/indian-passport-services/reissue-renewal-of-indian-passport-for-minors)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 6](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Motion (Framer Motion)](https://motion.dev/) |
| Cropping | [react-easy-crop](https://github.com/ValentinH/react-easy-crop) |
| Icons | [Lucide React](https://lucide.dev/) |
| Image Processing | HTML5 Canvas API (client-side, no server) |
| Deployment | GitHub Pages via GitHub Actions |

> **Privacy:** All image processing happens entirely in your browser. No photos are uploaded to any server.

---

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/ibrezm1/Passport-Photo-Maker.git
cd Passport-Photo-Maker

# 2. Install dependencies (clean install recommended)
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000/Passport-Photo-Maker/](http://localhost:3000/Passport-Photo-Maker/)

### Environment Variables (Optional)

Copy `.env.example` to `.env.local` and fill in your Gemini API key if you plan to extend the app with direct AI API calls:

```bash
cp .env.example .env.local
# Set GEMINI_API_KEY=your_key_here
```

> The app works fully without a Gemini API key — the AI prompt tool only generates a copyable prompt for manual use in external AI tools.

---

## Deploy to GitHub Pages

### Option A — Manual (one command)

```bash
npm run deploy
```

This runs `vite build` then pushes the `dist/` folder to the `gh-pages` branch.

### Option B — Automatic (GitHub Actions)

Every push to `main` automatically triggers the [deploy workflow](.github/workflows/deploy.yml), which builds and deploys to GitHub Pages.

**One-time setup required:**
1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Your live URL: `https://ibrezm1.github.io/Passport-Photo-Maker/`

---

## Project Structure

```
passport-photo-maker/
├── src/
│   ├── App.tsx                        # Root component, routing between steps & modes
│   ├── constants.ts                   # Photo size configs & guideline text arrays
│   ├── main.tsx                       # React entry point
│   ├── index.css                      # Global styles
│   ├── assets/
│   │   └── sample_guide.png           # Official reference guide image
│   ├── components/
│   │   ├── PhotoEditor.tsx            # Crop + brightness/contrast editor
│   │   ├── GuidelineValidator.tsx     # Manual checklist validator
│   │   ├── AIPromptValidator.tsx      # Copyable AI prompt generator
│   │   ├── PrintSheetGenerator.tsx   # A4 / 6×4 print sheet + digital download
│   │   └── ImageInspector.tsx        # Pixel & file size inspector tool
│   └── lib/
│       └── utils.ts                   # cn() Tailwind class helper
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions auto-deploy workflow
├── vite.config.ts                     # Vite config (base path for GitHub Pages)
├── index.html                         # HTML entry point with SEO meta tags
└── package.json                       # Scripts: dev, build, deploy
```

---

## License

MIT — free for personal and commercial use.
