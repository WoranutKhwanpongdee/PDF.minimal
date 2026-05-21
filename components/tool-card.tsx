import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
  const CardContent = (
    <div className="flex h-full flex-col">
      <div className="mb-2.5 flex items-start justify-between sm:mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100/80 text-zinc-700 ring-1 ring-zinc-200/50 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:bg-zinc-900 group-hover:text-white group-hover:ring-zinc-900 sm:h-10 sm:w-10">
          <Icon size={16} strokeWidth={1.5} className="sm:h-[18px] sm:w-[18px]" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 opacity-0 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 group-hover:bg-zinc-100 group-hover:text-zinc-900 group-hover:opacity-100">
          <ChevronRight size={15} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-auto">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-[15px]">{title}</h3>
        <p className="mt-1 text-[11px] leading-5 text-zinc-500 line-clamp-2 sm:text-xs">{description}</p>
      </div>
    </div>
  )

  const className =
    "group relative flex h-full min-h-[124px] w-full flex-col overflow-hidden rounded-[20px] border border-zinc-200/60 bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300/80 hover:shadow-xl hover:shadow-zinc-900/5 sm:min-h-[136px] sm:p-4"

  if (href) {
    return (
      <Link href={href} className={className}>
        {CardContent}
      </Link>
    )
  }

  return <button className={className}>{CardContent}</button>
}
