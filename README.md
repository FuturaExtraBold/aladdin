# Aladdin — IMDb Banner Ad

Interactive IMDb "Brand Experience" ad unit (970×250, desktop). React + Vite proof of concept.

## Project Highlights

- **Interactive 3D lamp** — `<model-viewer>` with cursor-tracked camera orbit, PBR brass/copper material, Draco-compressed to 177KB
- **WebGL plasma background** — domain-warped fBm noise shader in the Aladdin poster palette, running at cinematic speed
- **WebGL star field** — 300 point sprites with per-star twinkle, DPR-aware canvas for crisp retina rendering
- **CSS sparkle glints** — 12 four-point stars scattered across the lamp, rotating keyframe animation
- **Animated logo + 3 CTAs** — staggered slide-in reveals, gold gradient border via `padding-box`/`border-box`
- **Static SVG background** — radial gradient blooms + indigo top wash, black radial vignette overlay
- **98–99 Lighthouse** on a page running two WebGL canvases and a real-time 3D model — ~250KB gzipped total

## Stack

- React 19 + Vite
- Raw WebGL (no Three.js)
- [`@google/model-viewer`](https://modelviewer.dev/) via CDN for 3D
- Sharp for image compression (PNG → WebP)
- `gltf-pipeline` + Draco for GLB compression

## Structure

```
src/
├── creative/
│   ├── AdStage/          # 970×250 ad canvas
│   │   ├── AdStage.jsx   # model-viewer, mouse tracking, CTAs
│   │   ├── BgPlasma.jsx  # WebGL fBm plasma background
│   │   ├── Sparkle.jsx   # CSS sparkle glints
│   │   └── *.css
│   └── BgStatic/         # Full-page fixed background
│       ├── BgStatic.jsx  # SVG gradients + vignette
│       ├── StarField.jsx # WebGL star field
│       └── *.css
├── chrome/
│   ├── Header/           # IMDb chrome header
│   └── BigGreyBox/       # IMDb page body chrome
└── assets/
    ├── images/           # Source images (PNG)
    └── images-compressed/ # WebP output (auto-generated)

public/
├── genie.draco.glb       # Draco-compressed Aladdin lamp
└── robots.txt

scripts/
├── compress-assets.js    # PNG → WebP via Sharp
└── strip-colors.js       # Strip baseColorFactor from GLB
```

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build runs `compress-assets.js` first, converting all `src/assets/images/*.{png,jpg}` to WebP at Q20 into `src/assets/images-compressed/`.

## GLB Pipeline

To recompress a new model:

```bash
# Pack GLTF + BIN into a single GLB
gltf-pipeline -i model.gltf -o model.glb

# Draco compress
gltf-pipeline -i model.glb -o model.draco.glb --draco.compressionLevel 10

# Strip embedded color data (optional)
node scripts/strip-colors.js
```
