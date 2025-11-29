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
} from 'lucide-react'

export default function PracticePage() {
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

  // new states for AI questions
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [topic, setTopic] = useState('data structures') // default topic; changeable later
  const [difficulty, setDifficulty] = useState('medium') // easy | medium | hard
  const QUIZ_BATCH_SIZE = 8 // how many MCQs we ask the API for at once

  useEffect(() => {
    if (mode !== 'exam') return
    if (timeLeft === 0) {
      submitAnswer(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, timeLeft])

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // load a batch of questions from your API
  const fetchQuestionsBatch = async (opts?: {
    topic?: string
    difficulty?: string
    count?: number
  }) => {
    const t = opts?.topic ?? topic
    const d = opts?.difficulty ?? difficulty
    const count = opts?.count ?? QUIZ_BATCH_SIZE

    try {
      setLoadingQuestions(true)
      const res = await fetch('/api/generate-quiz-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: t,
          difficulty: d,
          quizCount: count,
          examCount: 0,
        }),
      })

      const json = await res.json()

      // Support both response shapes:
      // 1) { success: true, data: { quiz: [ { question, options, answer }, ... ], difficulty } }
      // 2) { question: { q, options, answer, explanation } } (older variant)
      let incoming: any[] = []

      if (json?.success && json?.data?.quiz && Array.isArray(json.data.quiz)) {
        incoming = json.data.quiz.map((q: any) => {
          // map API keys to the shape we use in the UI
          return {
            q: q.question ?? q.q ?? 'No question text',
            options: q.options ?? q.opts ?? q.choices ?? [],
            answer: q.answer ?? q.correct ?? null,
            explanation: q.explanation ?? q.expl ?? 'No explanation provided.',
            difficulty: json.data.difficulty ? capitalize(json.data.difficulty) : capitalize(d),
          }
        })
      } else if (json?.question) {
        const q = json.question
        incoming = [
          {
            q: q.q ?? q.question,
            options: q.options ?? q.choices,
            answer: q.answer ?? q.correct,
            explanation: q.explanation ?? 'No explanation provided.',
            difficulty: q.difficulty ?? capitalize(d),
          },
        ]
      } else if (Array.isArray(json)) {
        // in case the API returned raw array
        incoming = json.map((q: any) => ({
          q: q.question ?? q.q,
          options: q.options ?? q.choices,
          answer: q.answer ?? q.correct,
          explanation: q.explanation ?? 'No explanation provided.',
          difficulty: q.difficulty ?? capitalize(d),
        }))
      } else {
        // fallback - try to parse fields directly
        console.warn('Unexpected API response shape', json)
      }

      // append to existing questions (so UI can paginate through batch)
      setQuestions((prev) => [...prev, ...incoming])
    } catch (err) {
      console.error('Failed to fetch questions', err)
    } finally {
      setLoadingQuestions(false)
    }
  }

  useEffect(() => {
    // fetch initial batch on mount
    fetchQuestionsBatch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const current = questions[questionIndex] ?? {
    q: 'Loading question...',
    options: [],
    answer: null,
    explanation: '',
    difficulty: 'Medium',
  }

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

    setTimeout(async () => {
      setShowFeedback(false)
      setSelectedOption(null)
      setQuestionIndex((idx) => idx + 1)
      setQuestionStartTime(Date.now())

      // if we're getting close to the end of the loaded batch, fetch more questions
      if (questionIndex + 2 >= questions.length && !loadingQuestions) {
        await fetchQuestionsBatch()
      }
    }, 2500)
  }

  const restartQuiz = async () => {
    setScore(0)
    setQuestionIndex(0)
    setSelectedOption(null)
    setTimeLeft(60)
    setStreak(0)
    setAnsweredQuestions([])
    setShowFeedback(false)
    setTotalTime(0)
    setQuestionStartTime(Date.now())
    setQuestions([])
    await fetchQuestionsBatch({ topic, difficulty, count: QUIZ_BATCH_SIZE })
  }

  const accuracy =
    answeredQuestions.length > 0 ? Math.round((score / answeredQuestions.length) * 100) : 0

  // If we've exhausted loaded questions AND there's none left (and not loading), show results
  if (!loadingQuestions && questionIndex >= questions.length && questions.length > 0) {
    const avgTime =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + q.timeTaken, 0) / answeredQuestions.length
          )
        : 0

    return (
      <div className="min-h-screen p-4 md:p-8 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] backdrop-blur overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 backdrop-blur rounded-full p-6">
                  <Trophy className="w-16 h-16" />
                </div>
              </motion.div>
              <h2 className="text-4xl font-bold text-center mb-2">Quiz Completed!</h2>
              <p className="text-center text-white/90 text-lg">Outstanding performance! 🎉</p>
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
                    <h3 className="font-semibold text-gray-700">Score</h3>
                  </div>
                  <p className="text-4xl font-bold text-green-600">
                    {score}/{questions.length}
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

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Question Review
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {answeredQuestions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
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
                  onClick={restartQuiz}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)]"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-purple-600" />
            Quiz Practice Arena
            <Sparkles className="w-12 h-12 text-pink-600" />
          </h1>
          <p className="text-gray-600 text-lg">Master your skills with interactive challenges</p>
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
                      {score}/{Math.max(questions.length, 1)}
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
                      {questionIndex + (questions.length ? 1 : 0)}/{Math.max(questions.length, 1)}
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
                  Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quiz Mode
                    </label>
                    <Select value={mode} onValueChange={(v) => setMode(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">📝 Quiz Mode</SelectItem>
                        <SelectItem value="exam">⏱️ Exam Mode</SelectItem>
                        <SelectItem value="combined">🎯 Combined Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Topic</label>
                    <input
                      className="w-full px-3 py-2 border rounded-md"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. data structures, React, JavaScript"
                    />
                    <div className="mt-2 text-sm text-gray-500">Current: {topic}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Difficulty
                    </label>
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        fetchQuestionsBatch({ topic, difficulty, count: QUIZ_BATCH_SIZE })
                      }
                      className="flex-1"
                    >
                      Fetch More Questions
                    </Button>
                    <Button onClick={restartQuiz} className="flex-1">
                      Restart
                    </Button>
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

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className="font-bold text-purple-600">{accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Elapsed:</span>
                        <span className="font-bold text-blue-600">
                          {Math.floor(totalTime / 60)}m {totalTime % 60}s
                        </span>
                      </div>
                    </div>
                  </div>
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
                    Question {questionIndex + 1} of {questions.length || '...'}
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((questionIndex + 1) / Math.max(questions.length, 1)) * 100}%`,
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

                    {/* show a tiny loader when new batch is being fetched */}
                    {loadingQuestions && (
                      <div className="mt-4 text-sm text-gray-500">Fetching more AI questions…</div>
                    )}
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

// small helper
function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
