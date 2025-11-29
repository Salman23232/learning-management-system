import { usersTable } from '@/db/schema'
import { db } from '@/index'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, name } = await req.json()

  // Check if user already exists
  const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email))

  if (existingUsers.length > 0) {
    return NextResponse.json({
      success: false,
      message: 'User already exists',
    })
  }

  // Insert new user
  const result = await db.insert(usersTable).values({ name, email }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  })
  console.log(result[0])
  return NextResponse.json(result[0])
}
