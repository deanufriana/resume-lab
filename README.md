# Resume Lab

A modern, ATS-friendly resume builder built with Vue 3, TypeScript, Vite, and Tailwind CSS. Create professional resumes by uploading JSON files or filling in forms manually, then generate PDFs optimized for Applicant Tracking Systems.

## Features

- 📄 **JSON Upload & Export**: Seamlessly upload or download your resume data in standard JSON format.
- ✏️ **Manual Entry**: Intensive form management for all resume sections including Work, Education, Skills, Projects, and more.
- 🖱️ **Drag-and-Drop Reordering**: Intuitively reorder work experience, education, and other list entries with a smooth drag-and-drop interface.
- 🎨 **Multi-Theme Support**: Choose from different professional templates (e.g., Simple) optimized for ATS.
- 🖋️ **Signature Pad**: Draw and export your digital signature as a PNG file for professional use.
- 💾 **Local Storage Persistence**: Your progress is automatically saved to your browser, so you never lose your work.
- 👁️ **Live Preview**: See a real-time rendering of your resume with the selected theme.
- 📥 **PDF Generation**: Generate clean, ATS-friendly PDF resumes with one click.
- 🔔 **Real-time Feedback**: Toast notifications for saving, loading, and exporting actions.
- 📱 **Responsive UI**: A beautiful, premium interface that works across all device sizes.

## Tech Stack

- **Vue 3** - Modern, performant JavaScript framework.
- **TypeScript** - For robust, type-safe development.
- **Vite** - Lightning-fast build tool and development server.
- **Tailwind CSS** - Utility-first styling for a premium look and feel.
- **vuedraggable** - Smooth drag-and-drop experience.
- **html2pdf.js & jsPDF** - Client-side high-quality PDF generation.
- **VueUse** - Collection of essential Vue composition utilities.
- **Lucide Vue Next** - Beautiful, consistent icons.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### 1. Upload JSON Resume
- Navigate to the **Upload JSON** tab.
- Drag and drop your `resume.json` or download the example format to get started.

### 2. Manual Entry & Reordering
- Switch to the **Manual Entry** tab to fill in your details.
- Use the **::** handle to drag and reorder items within sections.
- Sections are collapsible for a cleaner editing experience.
- Click **Save Resume** to persist changes to local storage.

### 3. Signature Pad
- Go to the **Signature** tab to draw your professional signature.
- Click **Export PNG** to download it for use in documents.

### 4. Preview & Generate PDF
- High-quality preview is available in the **Preview** tab.
- Select your preferred **Theme** from the dropdown.
- Click **Generate PDF** to download your ATS-optimized resume.

## JSON Format

The application follows a structure compatible with standard JSON resume formats:

```json
{
  "basics": {
    "name": "Jane Doe",
    "label": "Software Engineer",
    "email": "jane@example.com",
    "location": { "city": "San Francisco", "region": "CA" },
    "profiles": [
      { "network": "GitHub", "username": "janedoe", "url": "https://github.com/janedoe" }
    ]
  },
  "work": [
    {
      "name": "Tech Corp",
      "position": "Senior Dev",
      "startDate": "2020-01-01",
      "highlights": ["Led a team of 5", "Optimized performance by 40%"]
    }
  ],
  "skills": [
    { "name": "Frontend", "keywords": ["Vue", "React", "TypeScript"] }
  ]
}
```

## Project Structure

```
resume-lab/
├── src/
│   ├── components/
│   │   ├── ui/           # Shared UI components (Button, Input, etc.)
│   │   ├── ResumeForm.vue
│   │   ├── ResumePreview.vue
│   │   └── SignaturePad.vue
│   ├── themes/           # Resume templates/themes
│   ├── composables/      # Shared logic (useToast, etc.)
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utilities (PDF, storage, etc.)
│   ├── data/             # Static data & examples
│   ├── App.vue           # Main application shell
│   └── main.ts           # Entry point
├── public/               # Static assets
└── ...configs            # Vite, Tailwind, TS configs
```

## ATS-Friendly Features

The generated PDFs are specifically optimized for ATS:
- **Clean Layout**: Avoids complex tables or columns that confuse parsers.
- **Scannable Text**: Ensures text remains searchable and selectable.
- **Standard Fonts**: Uses clean, professional typography.
- **Section Headers**: Uses clear hierarchies for automated categorization.

## Deployment

This project is configured for **GitHub Pages** via GitHub Actions. Pushing to `main` automatically triggers a deployment.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
