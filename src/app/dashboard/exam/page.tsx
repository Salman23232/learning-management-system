'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Clock,
  Trophy,
  Zap,
  Target,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

type QuizSetupState = {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  passingPercentage: number
  marksPerQuestion: number
}

export default function PracticePage() {
  // ═══════════════════════════════════════════════════════════════
  // State Management
  // ═══════════════════════════════════════════════════════════════

  // Setup Form
  const [showSetupForm, setShowSetupForm] = useState(true)
  const [setupData, setSetupData] = useState<QuizSetupState>({
    topic: 'data structures',
    difficulty: 'medium',
    questionCount: 10,
    passingPercentage: 60,
    marksPerQuestion: 1,
  })

  // Quiz Progress
  const [mode, setMode] = useState('quiz')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [streak, setStreak] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<any[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Questions
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  // Result Modal
  const [showResultModal, setShowResultModal] = useState(false)

  // ═══════════════════════════════════════════════════════════════
  // Timers
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (mode !== 'exam' || showSetupForm) return
    if (timeLeft === 0) {
      submitAnswer(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, timeLeft, showSetupForm])

  useEffect(() => {
    if (showSetupForm || showResultModal) return
    const timer = setInterval(() => {
      setTotalTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [showSetupForm, showResultModal])

  // ═══════════════════════════════════════════════════════════════
  // Fetch Questions
  // ═══════════════════════════════════════════════════════════════

  const fetchQuestions = async (count: number) => {
    try {
      setLoadingQuestions(true)
      const res = await fetch('/api/generate-quiz-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: setupData.topic,
          difficulty: setupData.difficulty,
          quizCount: count,
          examCount: 0,
        }),
      })

      const json = await res.json()
      let incoming: any[] = []

      if (json?.success && json?.data?.quiz && Array.isArray(json.data.quiz)) {
        incoming = json.data.quiz.map((q: any) => ({
          q: q.question ?? 'No question text',
          options: q.options ?? [],
          answer: q.answer ?? null,
          explanation: q.explanation ?? 'No explanation provided.',
          difficulty: capitalize(json.data.difficulty || setupData.difficulty),
        }))
      } else if (Array.isArray(json)) {
        incoming = json.map((q: any) => ({
          q: q.question ?? q.q,
          options: q.options ?? [],
          answer: q.answer ?? q.correct,
          explanation: q.explanation ?? 'No explanation provided.',
          difficulty: capitalize(setupData.difficulty),
        }))
      }

      setQuestions(incoming)
    } catch (err) {
      console.error('Failed to fetch questions', err)
    } finally {
      setLoadingQuestions(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Start Quiz Handler
  // ═══════════════════════════════════════════════════════════════

  const startQuiz = async () => {
    // Reset all states
    setScore(0)
    setQuestionIndex(0)
    setSelectedOption(null)
    setTimeLeft(60)
    setStreak(0)
    setAnsweredQuestions([])
    setShowFeedback(false)
    setTotalTime(0)
    setQuestionStartTime(Date.now())
    setShowSetupForm(false)

    // Fetch questions
    await fetchQuestions(setupData.questionCount)
  }

  const current = questions[questionIndex] ?? {
    q: 'Loading question...',
    options: [],
    answer: null,
    explanation: '',
    difficulty: 'Medium',
  }

  // ═══════════════════════════════════════════════════════════════
  // Submit Answer Handler
  // ═══════════════════════════════════════════════════════════════

  const submitAnswer = (timeUp = false) => {
    if (!selectedOption && !timeUp) return

    const correct = timeUp ? false : selectedOption === current.answer
    setIsCorrect(correct)
    setShowFeedback(true)

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000)

    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    setAnsweredQuestions((prev) => [
      ...prev,
      {
        question: current.q,
        selected: selectedOption,
        correct: current.answer,
        isCorrect: correct,
        timeTaken,
      },
    ])

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedOption(null)
      const nextIndex = questionIndex + 1

      // Check if quiz is complete
      if (nextIndex >= questions.length) {
        setShowResultModal(true)
      } else {
        setQuestionIndex(nextIndex)
        setQuestionStartTime(Date.now())
      }
    }, 2500)
  }

  // ═══════════════════════════════════════════════════════════════
  // Calculate Results
  // ═══════════════════════════════════════════════════════════════

  const totalMarks = setupData.questionCount * setupData.marksPerQuestion
  const obtainedMarks = score * setupData.marksPerQuestion
  const accuracy =
    answeredQuestions.length > 0 ? Math.round((score / answeredQuestions.length) * 100) : 0
  const isPassed = accuracy >= setupData.passingPercentage

  const getDifficultyColor = (difficultyStr: string) => {
    const d = (difficultyStr ?? '').toLowerCase()
    switch (d) {
      case 'easy':
        return 'text-green-500 bg-green-50'
      case 'medium':
        return 'text-yellow-500 bg-yellow-50'
      case 'hard':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Setup Form UI
  // ═══════════════════════════════════════════════════════════════

  if (showSetupForm) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-8 text-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Quiz Setup</h1>
                <Sparkles className="w-10 h-10" />
              </div>
              <p className="text-center text-white/90">Configure your quiz and let's begin! 🚀</p>
            </div>

            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📚 Quiz Topic
                  </label>
                  <input
                    type="text"
                    value={setupData.topic}
                    onChange={(e) => setSetupData({ ...setupData, topic: e.target.value })}
                    placeholder="e.g., Data Structures, React, JavaScript"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the subject you want to practice
                  </p>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🎯 Difficulty Level
                  </label>
                  <Select
                    value={setupData.difficulty}
                    onValueChange={(v) => setSetupData({ ...setupData, difficulty: v as any })}
                  >
                    <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Number of Questions
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={setupData.questionCount}
                    onChange={(e) =>
                      setSetupData({
                        ...setupData,
                        questionCount: Math.max(5, parseInt(e.target.value) || 10),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">Choose between 5 and 100 questions</p>
                </div>

                {/* Marks Per Question */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ⭐ Marks Per Question
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={setupData.marksPerQuestion}
                    onChange={(e) =>
                      setSetupData({
                        ...setupData,
                        marksPerQuestion: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Total marks will be: {setupData.questionCount * setupData.marksPerQuestion}
                  </p>
                </div>

                {/* Passing Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ✅ Passing Percentage
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={setupData.passingPercentage}
                      onChange={(e) =>
                        setSetupData({
                          ...setupData,
                          passingPercentage: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="px-4 py-2 bg-purple-100 rounded-lg text-purple-700 font-bold min-w-16 text-center">
                      {setupData.passingPercentage}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You need to score at least {setupData.passingPercentage}% to pass
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-200">
                  <h3 className="font-bold text-gray-800 mb-3">Quiz Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Questions</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {setupData.questionCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Marks</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {setupData.questionCount * setupData.marksPerQuestion}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">To Pass</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.ceil(
                          (setupData.passingPercentage / 100) *
                            setupData.questionCount *
                            setupData.marksPerQuestion
                        )}
                        /{setupData.questionCount * setupData.marksPerQuestion}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Difficulty</p>
                      <p className="text-2xl font-bold capitalize text-pink-600">
                        {setupData.difficulty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  disabled={loadingQuestions}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 disabled:opacity-50 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {loadingQuestions ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      Loading Questions...
                    </>
                  ) : (
                    <>
                      Start Quiz
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // Result Modal
  // ═══════════════════════════════════════════════════════════════

  if (showResultModal) {
    const avgTime =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + q.timeTaken, 0) / answeredQuestions.length
          )
        : 0

    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          {/* Congratulations Modal */}
          <AnimatePresence>
            {showResultModal && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                  {/* Header */}
                  <div
                    className={`p-8 text-white text-center ${
                      isPassed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-red-500 to-orange-600'
                    }`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: isPassed ? 3 : 1 }}
                      className="mb-4"
                    >
                      {isPassed ? (
                        <Trophy className="w-16 h-16 mx-auto" />
                      ) : (
                        <Target className="w-16 h-16 mx-auto" />
                      )}
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-2">
                      {isPassed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
                    </h2>
                    <p className="text-white/90">
                      {isPassed ? 'You passed the quiz! 🌟' : 'Better luck next time! 💪'}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="p-8">
                    <div className="space-y-6 mb-8">
                      {/* Marks */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200"
                      >
                        <p className="text-gray-600 mb-2">Your Score</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-5xl font-bold text-purple-600">{obtainedMarks}</p>
                          <p className="text-2xl text-gray-400">/ {totalMarks}</p>
                        </div>
                        <div className="mt-3 bg-white rounded-lg p-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${accuracy}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className={`h-3 rounded-full ${
                                isPassed ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                        <p className="text-center mt-2 text-lg font-bold text-gray-700">
                          {accuracy}%
                        </p>
                      </motion.div>

                      {/* Status */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`p-4 rounded-xl border-2 ${
                          isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p
                              className={`text-2xl font-bold ${
                                isPassed ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {isPassed ? '✅ PASSED' : '❌ FAILED'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Passing Score</p>
                            <p className="text-2xl font-bold text-gray-700">
                              {Math.ceil((setupData.passingPercentage / 100) * totalMarks)}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Stats */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                          <p className="text-sm text-gray-600">Avg. Time</p>
                          <p className="text-2xl font-bold text-blue-600">{avgTime}s</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200">
                          <p className="text-sm text-gray-600">Correct</p>
                          <p className="text-2xl font-bold text-pink-600">
                            {score}/{setupData.questionCount}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => setShowSetupForm(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Take Another Quiz
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detailed Results Card */}
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-8 text-white">
              <h2 className="text-4xl font-bold text-center mb-2">Quiz Results</h2>
              <p className="text-center text-white/90">Detailed performance analysis</p>
            </div>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-700">Final Score</h3>
                  </div>
                  <p className="text-4xl font-bold text-green-600">
                    {obtainedMarks}/{totalMarks}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{accuracy}% accuracy</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Avg Time</h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{avgTime}s</p>
                  <p className="text-sm text-gray-600 mt-1">per question</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-700">Best Streak</h3>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">
                    {Math.max(
                      ...answeredQuestions.map((_, i) => {
                        let currentStreak = 0
                        for (let j = i; j < answeredQuestions.length; j++) {
                          if (answeredQuestions[j].isCorrect) currentStreak++
                          else break
                        }
                        return currentStreak
                      }),
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">correct in a row</p>
                </motion.div>
              </div>

              {/* Question Review */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Question Review
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {answeredQuestions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className={`p-4 rounded-xl border-2 ${
                        q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">
                            Q{idx + 1}: {q.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            Your answer:{' '}
                            <span
                              className={
                                q.isCorrect
                                  ? 'text-green-600 font-semibold'
                                  : 'text-red-600 font-semibold'
                              }
                            >
                              {q.selected || 'No answer'}
                            </span>
                          </p>
                          {!q.isCorrect && (
                            <p className="text-sm text-gray-600">
                              Correct answer:{' '}
                              <span className="text-green-600 font-semibold">{q.correct}</span>
                            </p>
                          )}
                        </div>
                        {q.isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Completed in {q.timeTaken}s</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowSetupForm(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // Quiz Interface
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-purple-600" />
            Quiz Practice Arena
            <Sparkles className="w-12 h-12 text-pink-600" />
          </h1>
          <p className="text-gray-600 text-lg">
            {setupData.topic} • {setupData.questionCount} Questions • {setupData.difficulty}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Current Score</p>
                    <p className="text-4xl font-bold">
                      {score * setupData.marksPerQuestion}/{totalMarks}
                    </p>
                  </div>
                  <Award className="w-12 h-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Current Streak</p>
                    <p className="text-4xl font-bold">{streak} 🔥</p>
                  </div>
                  <Zap className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm mb-1">Progress</p>
                    <p className="text-4xl font-bold">
                      {questionIndex + 1}/{setupData.questionCount}
                    </p>
                  </div>
                  <Target className="w-12 h-12 text-pink-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Quiz Info
                </h3>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm text-gray-600 mb-2">📚 Topic</p>
                    <p className="font-bold text-gray-800 capitalize">{setupData.topic}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">⭐ Marks per Q</p>
                    <p className="font-bold text-gray-800">{setupData.marksPerQuestion}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">✅ To Pass</p>
                    <p className="font-bold text-gray-800">
                      {Math.ceil((setupData.passingPercentage / 100) * totalMarks)}/{totalMarks} (
                      {setupData.passingPercentage}%)
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-sm text-gray-600 mb-2">🎯 Difficulty</p>
                    <p className="font-bold text-gray-800 capitalize">{setupData.difficulty}</p>
                  </div>

                  {mode === 'exam' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Time Remaining</span>
                      </div>
                      <p className="text-3xl font-bold">{timeLeft}s</p>
                      <div className="w-full bg-white/30 rounded-full h-2 mt-3">
                        <motion.div
                          className="bg-white rounded-full h-2"
                          initial={{ width: '100%' }}
                          animate={{ width: `${(timeLeft / 60) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={() => setShowSetupForm(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Exit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                      current.difficulty
                    )}`}
                  >
                    {current.difficulty}
                  </span>
                  <span className="text-white/90 text-sm font-medium">
                    Question {questionIndex + 1} of {setupData.questionCount}
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((questionIndex + 1) / setupData.questionCount) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-relaxed">
                      {current.q}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {current.options && current.options.length > 0 ? (
                        current.options.map((opt: string, idx: number) => {
                          const letters = ['A', 'B', 'C', 'D']
                          const isSelected = selectedOption === opt

                          return (
                            <motion.button
                              key={idx}
                              onClick={() => !showFeedback && setSelectedOption(opt)}
                              disabled={showFeedback}
                              whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                              whileTap={!showFeedback ? { scale: 0.98 } : {}}
                              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                showFeedback
                                  ? opt === current.answer
                                    ? 'bg-green-500 text-white border-green-600 shadow-lg'
                                    : isSelected
                                    ? 'bg-red-500 text-white border-red-600'
                                    : 'bg-gray-100 text-gray-400 border-gray-200'
                                  : isSelected
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-xl'
                                  : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    showFeedback
                                      ? opt === current.answer
                                        ? 'bg-white text-green-600'
                                        : isSelected
                                        ? 'bg-white text-red-600'
                                        : 'bg-gray-200 text-gray-400'
                                      : isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-purple-100 text-purple-600'
                                  }`}
                                >
                                  {letters[idx]}
                                </div>
                                <span className="text-lg font-medium flex-1">{opt}</span>
                                {showFeedback && opt === current.answer && (
                                  <CheckCircle2 className="w-6 h-6" />
                                )}
                                {showFeedback && isSelected && opt !== current.answer && (
                                  <XCircle className="w-6 h-6" />
                                )}
                              </div>
                            </motion.button>
                          )
                        })
                      ) : (
                        <div className="p-6 rounded-xl bg-gray-50 text-gray-600">
                          {loadingQuestions ? 'Loading options...' : 'No options available.'}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`p-6 rounded-2xl mb-6 ${
                            isCorrect
                              ? 'bg-green-50 border-2 border-green-200'
                              : 'bg-red-50 border-2 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                            <h3
                              className={`font-bold text-lg ${
                                isCorrect ? 'text-green-800' : 'text-red-800'
                              }`}
                            >
                              {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                            </h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{current.explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={() => submitAnswer()}
                      disabled={!selectedOption || showFeedback || loadingQuestions}
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showFeedback ? 'Moving to next question...' : 'Submit Answer'}
                      {!showFeedback && <ChevronRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
