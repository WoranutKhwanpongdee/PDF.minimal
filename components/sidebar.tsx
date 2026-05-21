"use client"

import { LayoutGrid, FolderOpen, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "All Tools", href: "/", icon: LayoutGrid },
  { label: "My Files", href: "/files", icon: FolderOpen },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="relative w-full border-b border-zinc-200/60 bg-[#FAFAFA]/95 backdrop-blur-xl md:fixed md:left-0 md:top-0 md:h-screen md:w-[260px] md:border-b-0 md:border-r md:bg-[#FAFAFA]/80">
      <div className="mb-3 flex h-auto items-center px-4 py-4 md:mb-4 md:mt-2 md:h-16 md:px-6 md:py-0">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.pdf.png"
            alt="PDF.minimal Logo"
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
          />
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-tight text-zinc-900">PDF.minimal</p>
            <p className="mt-1 text-[11px] text-zinc-500">Minimal PDF tools</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 px-4 pb-4 md:flex-col md:gap-1.5 md:pb-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap md:w-auto",
                isActive
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50"
                  : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
