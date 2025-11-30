'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getAllUsersCourses } from '@/lib/action'

interface Course {
  bannerImage: string
  category: string
  cid: string
  courseId: string | null
  courseJson: any
  userEmail: string
}

interface UserCoursesContextType {
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  refreshCourses: () => Promise<void>
}

const UserCoursesContext = createContext<UserCoursesContextType | undefined>(undefined)

export function UserCoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([])
  const { user } = useUser()

  const refreshCourses = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return
    try {
      const data = await getAllUsersCourses(user.primaryEmailAddress.emailAddress)
      const formatted: Course[] = data.map((c: any) => ({
        bannerImage: c.bannerImage ?? '',
        category: c.category ?? '',
        cid: c.cid,
        courseId: c.id?.toString() ?? null, // <- map backend id to courseId
        courseJson: c.courseJson ?? {},
        userEmail: c.userEmail ?? '',
      }))
      setCourses(formatted)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    }
  }, [user?.primaryEmailAddress?.emailAddress])

  // Automatically fetch courses when user logs in
  useEffect(() => {
    refreshCourses()
  }, [refreshCourses])

  return (
    <UserCoursesContext.Provider value={{ courses, setCourses, refreshCourses }}>
      {children}
    </UserCoursesContext.Provider>
  )
}

export function useUserCourses() {
  const context = useContext(UserCoursesContext)
  if (!context) throw new Error('useUserCourses must be used inside UserCoursesProvider')
  return context
}
