"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export function Header() {
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  useEffect(() => {

    setHasToken(!!localStorage.getItem('access_token'));
    setMounted(true);

    // Если токен меняется в другой вкладке
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token') setHasToken(!!e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!mounted) return null;
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
          {!hasToken ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('access_token');
                setHasToken(false);
                router.refresh();       window.location.reload()
              }}
            >
              Logout
            </Button>
          )}
        </div>

      </div>
    </header>
  )
}
