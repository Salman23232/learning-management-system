'use client'

import { ArrowRight, Twitter } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import starImage from '../../public/assets/star.png'
import springImage from '../../public/assets/spring.png'
import ceoImage from '../../public/assets/CeoImage.png'
import Link from 'next/link'
import { Github, Instagram, Linkedin, X, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'

const CEO = () => {
  return (
    <section className="relative overflow-x-clip bg-gradient-to-b from-white to-[#D2DCFF] py-24 md:py-36">
      <div className="wrapper">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-14 md:gap-24">
          {/* Left Content */}
          <div className="relative max-w-xl text-center md:text-left">
            <p className=" tag uppercase text-sm tracking-wider font-semibold text-black/70 mb-3">
              Meet Our Founder
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black to-[#001E80]">
              Salman Ahmed
            </h2>

            <p className="text-xl mt-3 font-medium text-[#010D3E]/90">
              Founder & CEO — Karigori Coding School
            </p>

            <p className="text-lg md:text-xl text-[#010D3E] mt-6 leading-8">
              Salman Ahmed built Karigori Coding School with a mission to make world-class tech
              education accessible to everyone. Under his leadership, thousands of students have
              transformed their careers through practical, industry-focused learning.
            </p>

            {/* Decorative Elements */}
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
              src={starImage.src}
              alt="Star decoration"
              width={240}
              height={240}
              className="hidden md:block absolute -left-60 -top-32 opacity-80"
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
              alt="Spring decoration"
              width={220}
              height={220}
              className="hidden md:block absolute -right-40 -bottom-10 opacity-80"
            />

            <div className="flex justify-start gap-6 mt-10">
              <Link href={'https://x.com/SalmanAhmedDev'}>
                <Twitter />
              </Link>
              <Link href={'https://www.instagram.com/_salman_x_leo/'}>
                <Instagram />
              </Link>
              <Link href={'https://x.com/SalmanAhmedDev'}>
                <Linkedin />
              </Link>
              <Link href={'https://github.com/salman23232'}>
                <Github />
              </Link>
              <Link href={'https://www.youtube.com/@programmingwithsalmanahmed'}>
                <Youtube />
              </Link>
            </div>
          </div>

          {/* CEO Image */}
          <div className="flex justify-center md:justify-end w-full">
            <div className="relative">
              <Image
                src={ceoImage}
                alt="CEO Salman Ahmed"
                width={480}
                height={480}
                className="rounded-2xl shadow-xl max-w-[80%] md:max-w-none"
              />

              {/* Glow Background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#EAEEFE] to-[#D2DCFF] blur-3xl opacity-40 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CEO
