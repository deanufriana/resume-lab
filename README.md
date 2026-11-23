# Resume Lab

A modern, JSON-first resume studio built with Vue 3, TypeScript, Vite+, and Tailwind CSS. Edit your resume in a 3-pane workspace with live A4 preview, customize typography and themes, and export ATS-friendly Vector PDFs or pixel-accurate downloads.

## Features

- **3-Pane Studio Workspace**: Left section rail, center form editor, and live zoomable A4 canvas side-by-side on desktop (with a compact `Edit | Preview` switcher on mobile).
- **Live JSON Drawer & Sample Loader**: Inspect, edit, paste, import, or download raw JSON Resume data in real time, or load a sample resume in one click.
- **Smart Form Controls**: Interactive tag pills for skills/keywords, auto-sizing drag-and-drop highlight rows with multi-line paste, month/year pickers, and a **Current** role toggle.
- **3 ATS-Ready Themes + Customizer**: Switch between **Modern**, **Simple**, and **Professional** themes with live controls for Accent Color, Font (`Sans`, `Serif`, `Mono`), and Density (`Compact`, `Standard`, `Spacious`).
- **Upwork Privacy Mode**: Toggle **Hide Contact** to strip email, phone, website, street address, and social links from the preview and exports while keeping your form data intact.
- **Dual PDF Export**:
  - **Vector PDF** (`window.print()`): Produces selectable, searchable text and clickable links for ATS parsers.
  - **Download PDF** (`modern-screenshot` + `jsPDF`): 1-click A4 download with smart block-boundary pagination and `10mm` page margins.
- **Signature Studio**: Draw a signature, export an auto-cropped transparent (or white-background) PNG, or attach it directly to your resume footer.
- **Auto-Save & Dark Mode**: Debounced `localStorage` persistence with a quiet `Saved` indicator and an animated dark/light theme toggle.

## Tech Stack

- **Vue 3** + **TypeScript**
- **Vite+** (`vp`) — Unified toolchain (Vite, Rolldown, Vitest, Oxlint, Oxfmt)
- **Tailwind CSS** + **Radix Vue** + **Lucide Vue Next**
- **VueUse** & **vuedraggable**
- **modern-screenshot** & **jsPDF**

## Getting Started

### Prerequisites

- Node.js 18+ and [Vite+](https://viteplus.dev/guide/) (`vp`)

### Installation

```bash
git clone https://github.com/deanufriana/resume-lab.git
cd resume-lab
vp install
```

### Development & Verification

```bash
# Start local dev server
vp dev

# Format, lint, and type-check
vp check

# Run unit tests
vp test

# Type-check and build for production
vp run build
```

## Studio Workflow

1. **Start or Import**: Click **Sample** in the top bar to load example data, open the **JSON** drawer to import/paste a `.json` file, or type directly in the editor.
2. **Edit & Reorder**: Switch sections (`Basics`, `Work`, `Edu`, `Skills`, `Projects`, `More`) from the left rail. Drag handles (`⋮⋮`) to reorder roles, entries, or individual highlight bullets.
3. **Customize Canvas**: Use the toolbar above the A4 preview to switch themes, pick an accent color, adjust font family or spacing density, toggle **Hide Contact**, or change preview zoom (`Fit`, `75%`–`115%`).
4. **Signature (Optional)**: Open **Signature** in the top bar to draw, export an auto-cropped PNG, or toggle **Include signature on resume footer**.
5. **Export**:
   - Click **Vector PDF** for a selectable-text, clickable-link PDF via the browser print dialog.
   - Click **Download PDF** for an instant multi-page A4 download matching the preview.

## JSON Format

Compatible with the standard [JSON Resume](https://jsonresume.org/) schema, plus optional `meta` studio settings:

```json
{
  "basics": {
    "name": "Jane Doe",
    "label": "Software Engineer",
    "email": "jane@example.com",
    "location": { "city": "San Francisco", "region": "CA", "countryCode": "US" },
    "profiles": [
      { "network": "GitHub", "username": "janedoe", "url": "https://github.com/janedoe" }
    ]
  },
  "work": [
    {
      "name": "Tech Corp",
      "position": "Senior Dev",
      "startDate": "2020-01",
      "highlights": ["Led a team of 5", "Optimized performance by 40%"],
      "skills": ["Vue", "TypeScript"]
    }
  ],
  "skills": [{ "name": "Frontend", "keywords": ["Vue", "React", "TypeScript"] }],
  "meta": {
    "theme": "modern",
    "accentColor": "#2563eb",
    "fontFamily": "sans",
    "density": "standard",
    "hideContact": false
  }
}
```

## Project Structure

```text
resume-lab/
├── src/
│   ├── components/
│   │   ├── form/              # Section editors (Basics, Work, Education, Skills, Projects, Additional)
│   │   ├── ui/                # Shared UI primitives (Button, Input, TagInput, BulletListInput, etc.)
│   │   ├── AboutModal.vue
│   │   ├── CanvasToolbar.vue
│   │   ├── JsonDrawer.vue
│   │   ├── Navbar.vue
│   │   ├── ResumeForm.vue     # 3-pane Studio workspace
│   │   ├── ResumePreview.vue  # Scaled A4 canvas with page-break markers
│   │   ├── SignatureModal.vue
│   │   └── StudioRail.vue
│   ├── themes/                # Modern.vue, Simple.vue, Professional.vue
│   ├── composables/           # useResumePreview, useStableList, useToast
│   ├── types/                 # TypeScript interfaces
│   ├── utils/                 # pdf, privacy, date, storage, url, analytics + tests
│   ├── data/                  # Sample resume.json
│   ├── App.vue
│   └── main.ts
└── vite.config.ts
```

## Deployment

This project is configured for **GitHub Pages** via GitHub Actions. Pushing to `main` automatically triggers a build and deployment.

## License

MIT
