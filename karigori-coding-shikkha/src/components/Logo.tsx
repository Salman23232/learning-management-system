import { GraduationCap } from 'lucide-react'
import React from 'react'

const Logo = () => {
  return (
    <div className="flex gap-2">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-black">
          Karigori <br />
        </h1>
        <p className="text-sm">Coding School</p>
      </div>
    </div>
  )
}

export default Logo
