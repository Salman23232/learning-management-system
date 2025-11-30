'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import AddNewCourseDialog from './AddNewCourse'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Book, Compass, LayoutDashboard, GraduationCap, WalletCards, Plus } from 'lucide-react'
import Logo from '@/components/Logo'

const SidebarOptions = [
  { title: 'Overview', icon: LayoutDashboard, path: '/dashboard/overview', color: '#3B82F6' },
  { title: 'Ask AI', icon: Book, path: '/dashboard/ai-learning', color: '#8B5CF6' },
  { title: 'Explore Courses', icon: Compass, path: '/dashboard/explore', color: '#10B981' },
  { title: 'Practice With AI', icon: WalletCards, path: '/dashboard/practice', color: '#F59E0B' },
  { title: 'Exam', icon: GraduationCap, path: '/dashboard/exam', color: '#6366F1' },
]

export function AppSidebar() {
  const pathName = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Sidebar
      className="
    fixed top-0 left-0 h-screen
    w-64 bg-white/20 backdrop-blur-lg
    border-r border-gray-200/30
    shadow-xl overflow-hidden z-50
  "
    >
      {/* Glass gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background:
            'linear-gradient(180deg, rgba(234,238,254,0.3) 0%, rgba(210,220,255,0.2) 100%)',
        }}
      />

      {/* Sidebar Header */}
      <SidebarHeader className="p-6 relative z-10 border-b border-gray-200/30">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <Logo />
        </motion.div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="p-4 relative z-10">
        {/* Create Course Button */}
        <SidebarGroup className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AddNewCourseDialog>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white
                 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700
                 shadow-md hover:shadow-lg
                 transition-all duration-200 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              </motion.div>
            </AddNewCourseDialog>
          </motion.div>
        </SidebarGroup>

        {/* Sidebar Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              <AnimatePresence>
                {SidebarOptions.map((item, index) => {
                  const isActive = pathName.includes(item.path)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.path}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                              isActive
                                ? 'bg-white/20 shadow-inner text-black backdrop-blur-md'
                                : 'text-[#010D3E]/80 hover:bg-white/10'
                            }`}
                          >
                            {/* Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full"
                                style={{ backgroundColor: item.color }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              />
                            )}

                            <div className="flex items-center gap-3 relative z-10 flex-1">
                              <motion.div
                                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.3 }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                  isActive
                                    ? 'text-white'
                                    : hoveredIndex === index
                                    ? 'text-white'
                                    : 'text-[#010D3E]/70'
                                }`}
                                style={{
                                  backgroundColor:
                                    isActive || hoveredIndex === index
                                      ? item.color
                                      : 'rgba(255,255,255,0.1)',
                                }}
                              >
                                <item.icon className="w-5 h-5" />
                              </motion.div>

                              <span
                                className={`font-medium text-[15px] transition-all duration-200 ${
                                  isActive ? 'font-semibold' : ''
                                }`}
                              >
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4 border-t border-gray-200/30 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#183EC2] to-[#001E80] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#010D3E] mb-0.5">Need Help?</p>
                <p className="text-xs text-[#010D3E]/70 leading-relaxed">
                  Contact support for assistance
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  )
}
