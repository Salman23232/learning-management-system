import { coursesTable } from '@/db/schema'
import { db } from '@/index'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
  }

  const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId))

  return NextResponse.json(result[0] ?? null)
}
