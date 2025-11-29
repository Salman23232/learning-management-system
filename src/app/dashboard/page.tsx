'use client'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/dashboard/overview')
}
