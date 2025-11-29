'use client'
import { ArrowRight } from 'lucide-react'
import cogImage from '../../public/assets/cog.png'
import cylinderImage from '../../public/assets/cylinder.png'
import noodleImage from '../../public/assets/noodle.png'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
const Hero = () => {
  const { isSignedIn } = useUser()
  return (
    <section className="pt-10 pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip">
      <div className="wrapper">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag">AI Powered learning platform</div>
            <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
              Learn Anything you want with AI
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6 ">
              AI powered learning management platform which is designed to maximize your learning
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              {!isSignedIn ? (
                <>
                  <Link href="/sign-up">
                    <button className="btn btn-primary">Get Started for free</button>
                  </Link>

                  <Link href="/sign-in">
                    <button className="btn btn-text flex items-center gap-2">
                      Sign In <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard/overview">
                  <button className="btn btn-primary">Go to Dashboard</button>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={cogImage.src}
              alt="cog image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: 'easeInOut',
              }}
            />
            <motion.img
              src={cylinderImage.src}
              animate={{
                translateY: [-10, 10],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: 'easeInOut',
              }}
              alt="cylinder image"
              width={220}
              height={220}
              className="hidden md:block -top-2 -left-32 md:absolute"
            />
            <motion.img
              src={noodleImage.src}
              animate={{
                translateY: [-10, 10],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: 'easeInOut',
              }}
              alt="noodle image"
              width={220}
              className="hidden lg:block absolute top-[518px] left-[448px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
