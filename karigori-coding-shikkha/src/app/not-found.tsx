'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import cogImg from '../../public/assets/cog.png'
import cylinderImg from '../../public/assets/cylinder.png'
import noodleImg from '../../public/assets/noodle.png'

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center pt-20 pb-28 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip relative">
      <div className="wrapper relative z-10 max-w-3xl mx-auto">
        {/* CENTERED CONTENT */}
        <div className="flex flex-col items-center justify-center">
          <div className="tag mx-auto">Page Not Found</div>

          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 leading-tight">
            Oops! This page doesn’t exist.
          </h1>

          <p className="text-xl text-[#010D3E] tracking-tight mt-6 max-w-2xl">
            The page you're looking for has been moved, deleted, or never existed. Let’s get you
            back on track.
          </p>

          <div className="flex gap-3 items-center mt-8">
            <Link href="/dashboard/overview">
              <button className="btn btn-primary">Go to Dashboard</button>
            </Link>

            <Link href="/">
              <button className="btn btn-text flex items-center gap-1">
                Back to Home
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* FLOATING DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cog */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="hidden md:block absolute left-10 top-20"
        >
          <Image src={cogImg} alt="cog image" width={160} />
        </motion.div>

        {/* Cylinder */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="hidden md:block absolute right-40 -top-10"
        >
          <Image src={cylinderImg} alt="cylinder image" width={200} />
        </motion.div>

        {/* Noodle */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="hidden lg:block absolute bottom-10 right-56"
        >
          <Image src={noodleImg} alt="noodle image" width={200} />
        </motion.div>
      </div>

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-[400px] h-[400px] bg-white rounded-full blur-3xl -top-10 right-0" />
        <div className="absolute w-[300px] h-[300px] bg-[#183EC2] rounded-full blur-3xl bottom-0 left-10" />
      </div>
    </section>
  )
}
