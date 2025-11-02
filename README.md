# Resume Lab

A modern, ATS-friendly resume lab built with Vue 3, TypeScript, Vite, and Tailwind CSS. Create professional resumes by uploading JSON files or filling in forms manually, then generate PDFs optimized for Applicant Tracking Systems.

## Features

- 📄 **JSON Upload**: Upload your resume data in JSON format
- ✏️ **Manual Entry**: Fill out resume information through intuitive forms
- 👁️ **Live Preview**: See your resume before generating the PDF
- 📥 **PDF Generation**: Generate ATS-friendly PDF resumes
- 💾 **Export JSON**: Download your resume data as JSON
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **jsPDF** - PDF generation library
- **html2canvas** - Convert HTML to canvas for PDF export

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

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

### Upload JSON Resume

1. Click on the "Upload JSON" tab
2. Drag and drop a JSON file or click to browse
3. The JSON should match the resume format (see JSON Format section below)
4. Once loaded, you can preview and generate PDF

### Manual Entry

1. Click on the "Manual Entry" tab
2. Fill in your information:
   - Basic Information (name, email, phone, etc.)
   - Work Experience (add multiple entries)
   - Education (add multiple entries)
   - Skills (add multiple entries)
3. Click "Save Resume" when done
4. Switch to "Preview" tab to see your resume

### Generate PDF

1. Navigate to the "Preview" tab
2. Review your resume
3. Click "Generate PDF" button
4. The PDF will be downloaded automatically with an ATS-friendly filename

### Export JSON

1. In the "Preview" tab, click "Download JSON"
2. Your resume data will be saved as a JSON file

## JSON Format

The JSON should follow this structure:

```json
{
  "basics": {
    "name": "Your Name",
    "label": "Job Title",
    "email": "email@example.com",
    "phone": "+1 (555) 123-4567",
    "url": "https://yourwebsite.com",
    "summary": "Professional summary",
    "location": {
      "city": "City",
      "region": "State/Province",
      "postalCode": "12345",
      "countryCode": "US"
    }
  },
  "work": [
    {
      "name": "Company Name",
      "position": "Job Title",
      "url": "https://company.com",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "summary": "Job summary",
      "highlights": [
        "Achievement 1",
        "Achievement 2"
      ],
      "skills": ["Skill1", "Skill2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "area": "Field of Study",
      "studyType": "Bachelor's",
      "startDate": "2016-01-01",
      "endDate": "2020-05-01",
      "score": "3.8"
    }
  ],
  "skills": [
    {
      "name": "Web Development",
      "level": "Expert",
      "keywords": ["JavaScript", "Vue.js", "React"]
    }
  ],
  "certificates": [],
  "projects": [],
  "languages": []
}
```

## Project Structure

```
resume-lab/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── ResumeForm.vue
│   │   └── ResumePreview.vue
│   ├── types/
│   │   └── resume.ts     # TypeScript interfaces
│   ├── utils/
│   │   ├── cn.ts         # Utility for class merging
│   │   └── pdf.ts        # PDF generation logic
│   ├── App.vue           # Main application component
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## ATS-Friendly Features

The generated PDFs are optimized for Applicant Tracking Systems:

- Clean, simple layout without complex formatting
- Standard fonts (Times New Roman)
- Proper text structure with headings
- No images or graphics that might confuse parsers
- Clear section separation
- Standard date formats
- Professional formatting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
