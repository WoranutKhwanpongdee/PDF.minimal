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
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-zinc-200/60 bg-[#FAFAFA]/80 backdrop-blur-xl">
      <div className="mb-4 mt-2 flex h-16 items-center px-6">
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

      <nav className="flex flex-col gap-1.5 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
