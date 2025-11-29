'use client'

import { ArrowRight } from 'lucide-react'
import starImage from '../../public/assets/star.png'
import springImage from '../../public/assets/spring.png'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'

const CallToAction = () => {
  const { isSignedIn, user } = useUser()

  return (
    <section className="bg-gradient-to-b from-white to-[#D2DCFf] py-24">
      <div className="wrapper">
        <div className="section-heading relative">
          <h2 className="section-title">Sign up for free today</h2>
          <p className="section-description mt-5">
            Sign up today and start maximizing your learning. Learn any topic faster with AI.
          </p>

          <motion.img
            src={starImage.src}
            animate={{
              translateY: [-15, 15],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 2,
              ease: 'easeInOut',
            }}
            alt="star"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
          />

          <motion.img
            animate={{
              translateY: [-15, 15],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 2,
              ease: 'easeInOut',
            }}
            src={springImage.src}
            alt="spring"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
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
    </section>
  )
}

export default CallToAction
