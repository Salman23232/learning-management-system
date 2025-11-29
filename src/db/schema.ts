import { boolean, integer, json, pgTable, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
})

export const coursesTable = pgTable('courses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 1024 }),
  level: varchar({ length: 50 }).notNull(),
  category: varchar({ length: 100 }),
  totalDuration: integer(),
  bannerImage: varchar({ length: 255 }),
  createdAt: varchar({ length: 100 }),
  courseJson: json(),
  // Fixed: userEmail references usersTable.email correctly
  userEmail: varchar({ length: 255 }).references(() => usersTable.email),
})
