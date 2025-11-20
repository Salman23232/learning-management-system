import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative hidden md:flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <Image src="/image-1.jpg" alt="" fill className="object-cover" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to access your account</p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <SignIn
          appearance={{
            elements: {
              card: 'w-full max-w-md shadow-lg',
              headerTitle: 'text-2xl font-bold text-center',
              headerSubtitle: 'text-center text-gray-500',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              footerActionLink: 'text-blue-600 hover:text-blue-800',
            },
          }}
        />
      </div>
    </div>
  )
}
