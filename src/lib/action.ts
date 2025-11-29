'use server'

import { db } from '@/index'
import { coursesTable } from '@/db/schema'
import { eq, ne } from 'drizzle-orm'

export async function saveCourseToDb(courseData: any) {
  try {
    await db.insert(coursesTable).values(courseData)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function getAllUsersCourses(userEmail: string) {
  if (!userEmail) return []

  try {
    const res = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, userEmail))
    return res
  } catch (error) {
    console.error(error)
    return []
  }
}
// Fetch all courses excluding the user's own courses
export async function getCommunityCourses(userEmail: string) {
  if (!userEmail) return []

  try {
    const res = await db.select().from(coursesTable).where(ne(coursesTable.userEmail, userEmail))
    return res
  } catch (error) {
    console.error(error)
    return []
  }
}
