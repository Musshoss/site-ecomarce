import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pagination({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav className={cn("flex w-full justify-center", className)} {...props} />
}

export function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex items-center gap-1", className)} {...props} />
}

export function PaginationItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

export function PaginationLink({
  className,
  isActive,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </a>
  )
}

export function PaginationNext({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </a>
  )
}

export function PaginationEllipsis({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      ...
    </span>
  )
}
