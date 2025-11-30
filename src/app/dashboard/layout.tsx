'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_component/Appsiderbar'
import AppHeader from './_component/AppHeader'
import '../globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppHeader />
        <div>{children}</div>
      </main>
    </SidebarProvider>
  )
}
