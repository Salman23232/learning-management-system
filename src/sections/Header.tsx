'use client'
import React from 'react'
import { ArrowRight, GraduationCap, MenuIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

const Header = () => {
  const { isSignedIn, user } = useUser()

  return (
    <header className="sticky top-0 backdrop-blur-sm bg-[#EAEEFE]/80 z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-small">
        <div className="inline-flex gap-1 items-center">
          <p>Get started for free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>

      <div className="flex justify-between items-center py-5 wrapper h-16">
        <Logo />
        <MenuIcon className="h-5 w-5 md:hidden" />

        <nav className="hidden md:flex items-center gap-6 text-black/60">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Customers</a>
          <a href="#">Updates</a>
          <a href="#">Help</a>

          {!isSignedIn ? (
            <>
              <Link href="/sign-up">
                <button className="btn btn-primary">Get Started for free</button>
              </Link>

              <Link href="/sign-in">
                <button className="btn btn-text flex items-center gap-2">
                  Sign In <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard/overview">
              <button className="btn btn-primary">Go to Dashboard</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
