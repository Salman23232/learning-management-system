'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AppHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-[#EAEEFE]/80 backdrop-blur-sm border-b border-[#D2DCFF] shadow-sm"
    >
      <div className="px-6 py-4 flex justify-between items-center wrapper">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-[#D2DCFF] rounded-lg transition-colors p-2" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#D2DCFF]">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 rounded-xl',
                },
              }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default AppHeader
