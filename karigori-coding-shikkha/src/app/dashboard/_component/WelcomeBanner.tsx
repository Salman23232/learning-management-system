'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Rocket } from 'lucide-react'

const WelcomeBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="  relative p-8 text-white bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity },
        }}
        className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white">
                Welcome to Karigori Coding School
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg font-medium"
            >
              Learn and explore your favorite courses with AI-powered learning
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeBanner
