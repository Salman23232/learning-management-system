'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import acmeLogo from '../../public/assets/logo-acme.png'
import quantumLogo from '../../public/assets/logo-quantum.png'
import celestialLogo from '../../public/assets/logo-celestial.png'
import pulseLogo from '../../public/assets/logo-pulse.png'
import apexLogo from '../../public/assets/logo-apex.png'

const logos = [acmeLogo, quantumLogo, celestialLogo, pulseLogo, apexLogo]

const LogoTicker = () => {
  return (
    <div className="wrapper py-12">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
        <motion.div
          className="flex gap-14 flex-none"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 5, // medium speed
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {/* first set */}
          {logos.map((logo, i) => (
            <Image key={i} className="logo-ticker-image" src={logo} alt="Logo" />
          ))}

          {/* duplicate set for infinite loop */}
          {logos.map((logo, i) => (
            <Image key={`duplicate-${i}`} className="logo-ticker-image" src={logo} alt="Logo" />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LogoTicker
