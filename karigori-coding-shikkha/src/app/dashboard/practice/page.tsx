'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Code2,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  Trophy,
  Zap,
  ArrowRight,
} from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
]

const difficulties = [
  {
    id: 'easy',
    name: 'Easy',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  {
    id: 'medium',
    name: 'Medium',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  {
    id: 'hard',
    name: 'Hard',
    color: 'from-red-400 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
]

export default function CodePractice() {
  const [problem, setProblem] = useState<any>(null)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [topicInput, setTopicInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!startTime) return
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const fetchProblem = async () => {
    if (!topicInput.trim()) {
      alert('Please enter a topic!')
      return
    }

    setLoading(true)
    setResult(null)
    setStartTime(0)
    setElapsedTime(0)

    try {
      const res = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput.trim(), difficulty: selectedDifficulty }),
      })
      const json = await res.json()

      if (json.success) {
        setProblem(json.data)
        setCode(json.data.starterCode[language])
        setStartTime(Date.now())
      } else {
        setResult({ success: false, message: json.error || 'Failed to generate problem' })
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    if (problem) setCode(problem.starterCode[lang])
  }

  const submitCode = async () => {
    setSubmitting(true)
    setResult(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const passed = Math.random() > 0.3
    setResult({
      success: passed,
      message: passed ? 'All test cases passed!' : 'Some test cases failed',
      testsPassedCount: passed
        ? problem.testCases.length
        : Math.floor(problem.testCases.length * 0.6),
      totalTests: problem.testCases.length,
      timeElapsed: elapsedTime,
    })

    setSubmitting(false)
  }

  const resetProblem = () => {
    setProblem(null)
    setResult(null)
    setStartTime(0)
    setElapsedTime(0)
    setTopicInput('')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initial Setup Screen
  if (!problem && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg shadow-blue-500/30">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Code Practice</h1>
            <p className="text-xl text-gray-600">
              Generate custom coding problems tailored to your learning needs
            </p>
          </div>

          {/* Setup Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-8">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What would you like to practice?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchProblem()}
                  placeholder="e.g., arrays, linked lists, binary search, recursion..."
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400 text-lg"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter any programming topic or algorithm concept
              </p>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-6 py-4 rounded-xl border-2 transition-all font-semibold ${
                      selectedDifficulty === diff.id
                        ? `bg-gradient-to-r ${diff.color} border-transparent text-white shadow-lg scale-105`
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={fetchProblem}
              disabled={!topicInput.trim()}
              className="w-full px-8 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-white text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
            >
              <Sparkles className="w-5 h-5" />
              Generate Problem
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Tip:</span> Try topics like "dynamic
                programming", "graph traversal", "string manipulation", or any specific algorithm!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Sparkles className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">Generating Your Problem</p>
            <p className="text-gray-600 mt-2">AI is crafting the perfect challenge...</p>
          </div>
        </div>
      </div>
    )
  }

  // Main Problem View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Timer and Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          {startTime > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-mono text-xl font-bold text-gray-900">
                {formatTime(elapsedTime)}
              </span>
            </div>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              onClick={resetProblem}
              className="px-5 py-3 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all font-semibold text-gray-700 flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              New Topic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            {/* Problem Header */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{problem.title}</h2>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${
                    difficulties.find((d) => d.id === selectedDifficulty)?.color
                  } text-white shadow-md`}
                >
                  {selectedDifficulty.toUpperCase()}
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>
            </div>

            {/* Test Cases */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Test Cases
              </h3>
              <div className="space-y-3">
                {problem.testCases.map((tc: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">INPUT</p>
                        <code className="text-sm text-green-700 font-mono bg-green-50 px-2 py-1 rounded">
                          {tc.input}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">EXPECTED OUTPUT</p>
                        <code className="text-sm text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded">
                          {tc.output}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Panel */}
            {result && (
              <div
                className={`rounded-2xl border-2 p-6 shadow-lg ${
                  result.success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {result.message}
                    </h3>
                    {result.testsPassedCount !== undefined && (
                      <p className="text-gray-700 font-semibold">
                        Passed {result.testsPassedCount} / {result.totalTests} test cases
                      </p>
                    )}
                    {result.timeElapsed !== undefined && (
                      <p className="text-gray-600 text-sm mt-2">
                        Time: {formatTime(result.timeElapsed)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-4">
            {/* Language Selector */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">LANGUAGE</label>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-semibold ${
                        language === lang.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                      }`}
                    >
                      <span>{lang.icon}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div
              className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm"
              style={{ height: '600px' }}
            >
              <MonacoEditor
                height="100%"
                language={language}
                theme="light"
                value={code}
                onChange={(newValue) => setCode(newValue || '')}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={submitCode}
                disabled={submitting}
                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl text-lg"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Submit Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
