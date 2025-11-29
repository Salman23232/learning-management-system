'use client'

import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Decorative assets
import cog from '../../../../../public/assets/cog.png'
import cylinder from '../../../../../public/assets/cylinder.png'
import noodle from '../../../../../public/assets/noodle.png'

export default function Page() {
  return (
    <div className="min-h-screen w-full flex bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full relative"
        >
          <Image src="/image-1.jpg" alt="Sign in illustration" fill className="object-cover" />
        </motion.div>
      </div>

      {/* RIGHT SIDE: FORM + DECORATIONS */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative p-8 bg-white/60 backdrop-blur-sm">
        {/* Cog – infinite bounce */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 0.9,
            y: [0, -15, 0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -right-0 top-2 hidden lg:block z-0"
        >
          <Image src={cog} alt="" width={300} height={200} />
        </motion.div>

        {/* Cylinder – infinite bounce */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 0.9,
            y: [0, -15, 0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -left-0 bottom-10 hidden md:block z-0"
        >
          <Image src={cylinder} alt="" width={240} height={180} />
        </motion.div>

        {/* Noodle – infinite bounce */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{
            y: [0, -12, 0, -6, 0],
            opacity: 0.9,
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[70%] right-[2%] hidden lg:block z-0"
        >
          <Image src={noodle} alt="" width={200} height={180} />
        </motion.div>

        {/* SIGN-IN FORM */}
        <div className="relative z-20">
          <SignIn
            forceRedirectUrl="/dashboard/overview"
            appearance={{
              elements: {
                card: 'w-full max-w-md shadow-lg rounded-xl bg-white/90 backdrop-blur-md',
                headerTitle:
                  'text-3xl font-bold text-center bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text uppercase tracking-tighter',
                headerSubtitle: 'text-center text-[#010D3E]/70 text-lg mt-2',
                formButtonPrimary: 'bg-black hover:bg-black/90 text-white rounded-lg py-2 mt-4',
                footerActionLink: 'text-[#183EC2] hover:text-[#001E80] font-medium',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
