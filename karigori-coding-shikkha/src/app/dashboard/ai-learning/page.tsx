'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Volume2, Loader2, Languages, Mic, MessageSquare } from 'lucide-react'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

export default function Page() {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [language, setLanguage] = useState<'en' | 'bn'>('en')
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([])

  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    document.documentElement.style.height = '100vh'
  }, [])

  const speakText = async (textToSpeak: string, lang: 'en' | 'bn' = 'en') => {
    if (lang === 'en') {
      if (!('speechSynthesis' in window)) {
        alert('Your browser does not support speech synthesis')
        return
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = 'en-US'
      utterance.rate = 1
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    } else {
      try {
        const res = await fetch('/api/speak-bangla', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, language: 'bn' }),
        })

        if (!res.ok) throw new Error('Failed to generate Bangla audio')

        const audioBlob = await res.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
      } catch (err) {
        console.error('Bangla TTS error:', err)
        alert('Failed to play Bangla audio')
      }
    }
  }

  const askAI = async () => {
    if (!text.trim()) return

    const userMessage = text
    setText('')
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/get-ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language }),
      })

      const data = await res.json()

      if (data.success) {
        setMessages((prev) => [...prev, { type: 'ai', text: data.text }])
        await speakText(data.text, language)
      } else {
        alert('AI Error: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to connect to AI')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      askAI()
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full">
        <Spline scene="https://prod.spline.design/Ddn0AB4jjrDA4yYN/scene.splinecode" />
      </div>

      {/* Chat Messages */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-32 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl max-h-[50vh] overflow-y-auto z-10 space-y-4 px-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#0ff transparent',
            }}
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-6 py-4 rounded-3xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-black/60 backdrop-blur-xl border border-cyan-500/30 text-cyan-100 shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {msg.type === 'ai' && (
                      <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-8 left-[62rem] -translate-x-1/2 w-[90%] max-w-4xl z-20"
      >
        <div className="relative">
          {/* Glow Effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(0, 255, 255, 0.3)',
                '0 0 50px rgba(0, 255, 255, 0.5)',
                '0 0 30px rgba(0, 255, 255, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"
          />

          {/* Input Container */}
          <div className="relative bg-black/80 backdrop-blur-2xl border border-cyan-500/40 rounded-[2rem] p-2 shadow-2xl">
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-2xl border border-cyan-500/30 transition-all disabled:opacity-50"
              >
                <Languages className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">
                  {language === 'en' ? 'EN' : 'বাং'}
                </span>
              </motion.button>

              {/* Input Field */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={loading ? 'AI is thinking...' : 'Ask me anything...'}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-transparent border-none outline-none text-lg font-medium text-white placeholder:text-cyan-400/50 disabled:opacity-50"
                />
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Loader2 className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                )}
              </div>

              {/* Voice Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-500/30 transition-all disabled:opacity-50"
              >
                <Mic className="w-5 h-5 text-purple-400" />
              </motion.button>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={askAI}
                disabled={loading || !text.trim()}
                className="relative group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl font-bold text-white shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Ask</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Stats/Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-4 text-xs text-cyan-400/60"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Press Enter to send</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>AI will speak the answer</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      <div
        className="absolute top-1/3 right-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute bottom-1/3 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}
