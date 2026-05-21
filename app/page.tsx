import {
  Combine,
  Scissors,
  FileDown,
  FileText,
  ScanText,
  Stamp,
  Lock,
  Unlock,
  Image,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ToolCard } from "@/components/tool-card"

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document",
    icon: Combine,
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Extract specific pages or separate a PDF into multiple files",
    icon: Scissors,
    href: "/split-pdf",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size significantly without losing quality",
    icon: FileDown,
    href: "/compress-pdf",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Microsoft Word files",
    icon: FileText,
    href: "/pdf-to-word",
  },
  {
    title: "OCR Scanner",
    description: "Extract text from scanned PDFs or image formats",
    icon: ScanText,
    href: "/ocr-scanner",
  },
  {
    title: "Add Watermark",
    description: "Stamp custom text or images onto your PDF pages",
    icon: Stamp,
    href: "/add-watermark",
  },
  {
    title: "Protect PDF",
    description: "Secure your document with a strong password",
    icon: Lock,
    href: "/protect-pdf",
  },
  {
    title: "Unlock PDF",
    description: "Remove passwords and security restrictions from PDFs",
    icon: Unlock,
    href: "/unlock-pdf",
  },
  {
    title: "Image to PDF",
    description: "Convert JPG, PNG, and other images to PDF format",
    icon: Image,
    href: "/image-to-pdf",
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-10rem] h-[40rem] w-[40rem] rounded-full bg-zinc-900/5 blur-3xl" />
        <div className="absolute right-[-15rem] top-[10rem] h-[45rem] w-[45rem] rounded-full bg-zinc-700/5 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[20rem] h-[40rem] w-[40rem] rounded-full bg-zinc-500/5 blur-3xl" />
      </div>

      <Sidebar />

      <main className="relative z-10 min-h-screen px-4 py-5 md:ml-[260px] md:px-5 md:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 flex flex-col items-start gap-3 sm:mb-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-900 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-900"></span>
              </span>
              Private, local-first PDF tools
            </div>

            <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-[1.75rem] font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                  All Tools
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  Minimal, fast, and secure. Processed entirely on your device, ensuring your files remain private.
                </p>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2.5 text-center text-sm text-zinc-500 md:w-auto md:justify-end md:flex-nowrap">
                <div className="flex min-w-[74px] flex-1 flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-md md:flex-none">
                  <span className="text-lg font-semibold text-zinc-900">9</span>
                  <span className="text-xs font-medium">Tools</span>
                </div>
                <div className="flex min-w-[74px] flex-1 flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-md md:flex-none">
                  <span className="text-lg font-semibold text-zinc-900">0</span>
                  <span className="text-xs font-medium">Uploads</span>
                </div>
                <div className="flex min-w-[74px] flex-1 flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-md md:flex-none">
                  <span className="text-lg font-semibold text-zinc-900">100%</span>
                  <span className="text-xs font-medium">Local</span>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:gap-4">
            {tools.map((tool) => (
              <ToolCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
