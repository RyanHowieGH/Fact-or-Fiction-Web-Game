"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSupabase } from "@/components/supabase-provider"
import { useState } from "react"
import { LoginModal } from "@/components/login-modal"
import { Trophy, User, Home } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { session } = useSupabase()
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-950 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Fact or Fiction?
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" passHref>
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                <Home className="h-4 w-4 mr-2" />
                Play
              </Button>
            </Link>
            <Link href="/leaderboard" passHref>
              <Button variant={pathname === "/leaderboard" ? "default" : "ghost"} size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            {session ? (
              <Link href="/profile" passHref>
                <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(true)}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            <div className="md:hidden flex items-center space-x-1">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/leaderboard" passHref>
                <Button variant="ghost" size="icon">
                  <Trophy className="h-5 w-5" />
                </Button>
              </Link>
              {session ? (
                <Link href="/profile" passHref>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setShowLoginModal(true)}>
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  )
}
