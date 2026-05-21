# PDF.minimal

A modern, fast, and secure local-first PDF manipulation tool built with Next.js and React.

## 🚀 Features

- **100% Local Processing:** All PDF manipulations are done entirely on your device using client-side JavaScript (`pdf-lib`). Your files are **never** uploaded to any server, ensuring complete privacy.
- **Modern UI/UX:** Clean, spacious, and responsive design built with Tailwind CSS and glassmorphic elements.
- **Comprehensive Toolset:**
  - Merge PDFs
  - Split PDFs
  - Compress PDFs
  - Convert PDF to Word (Client-side extraction)
  - OCR Scanner (Client-side Tesseract.js integration)
  - Add Watermarks
  - Protect PDFs (Add passwords)
  - Unlock PDFs (Remove passwords)
  - Convert Images to PDF
- **Activity Log:** Keeps track of your recently processed files locally.
- **Customizable Preferences:** Set default file prefixes for output files.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Manipulation:** `pdf-lib` and `pdfjs-dist` (Runs entirely in the browser)
- **Document Generation:** `docx`
- **State Management:** LocalStorage (via custom store)

## 📦 Getting Started

### Prerequisites

- Node.js (v22.13.0 or higher required)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pdf.minimal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ☁️ Deployment

The easiest way to deploy your Next.js app is to use the Vercel Platform.

1. Push your code to a Git repository (GitHub, GitLab, or BitBucket).
2. Import the project into Vercel.
3. Ensure the **Node.js Version** in Vercel settings (Settings > General) is set to `22.x`.
4. Click **Deploy**.

## 🔒 Privacy & Security

PDF.minimal is designed with privacy as the core principle. Because it leverages modern browser APIs and libraries like `pdf-lib` and `tesseract.js`, the actual file processing happens locally on your machine's CPU and memory. 

- **No Uploads:** Files do not leave your browser.
- **No Cloud Storage:** We do not store your documents.
- **Offline Capable:** Once loaded, core features can function without an active internet connection.

## 📝 License

This project is licensed under the MIT License.
