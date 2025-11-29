'use client'
import { createContext, useState, ReactNode } from 'react'

// 1. Define the user details type
interface UserDetails {
  id: string
  name: string
  email: string
  // Add other user properties you need
}

// 2. Define the context type
interface UserDetailsContextType {
  user: UserDetails | null
  setUser: (user: UserDetails | null) => void
}

// 3. Create context with type and default value
export const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined)

// 4. Create the Provider component
export const Provider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetails | null>(null)

  return (
    <UserDetailsContext.Provider value={{ user, setUser }}>{children}</UserDetailsContext.Provider>
  )
}
