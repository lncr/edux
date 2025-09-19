"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-primary">Edux</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/universities" className="text-foreground hover:text-primary transition-colors">
            Universities
          </Link>
          <Link href="/my-applications" className="text-foreground hover:text-primary transition-colors">
            My Applications
          </Link>
          <Link href="/profile" className="text-foreground hover:text-primary transition-colors">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
