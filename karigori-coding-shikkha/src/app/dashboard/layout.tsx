'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_component/Appsiderbar'
import AppHeader from './_component/AppHeader'
import '../globals.css'
import { redirect } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser()
  if (!isSignedIn) {
    redirect('/sign-in')
  }
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
