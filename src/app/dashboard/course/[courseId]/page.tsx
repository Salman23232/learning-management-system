'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BookOpen, AlertCircle, RefreshCw, Play, Clock, Users, Sparkles } from 'lucide-react'
import CourseInfo from '../_components/CourseInfo'
import { useCourse } from '@/context/useCourse'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const PageClient = () => {
  const { courseId } = useParams()
  const { setCourseData, setSelectedCourse } = useCourse()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const getCourseInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`/api/courses?courseId=${courseId}`)
      setData(res.data)
      setCourseData(res.data)
      setSelectedCourse(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      getCourseInfo()
    }
  }, [courseId, setCourseData, setSelectedCourse])

  // Loading State
  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: 'radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)',
        }}
      >
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <Skeleton className="h-10 w-80" />
                <Skeleton className="h-5 w-full max-w-lg" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-14 w-32 rounded-xl" />
                <Skeleton className="h-14 w-32 rounded-xl" />
              </div>
            </div>
          </div>
          s{/* Main Content Skeleton */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 bg-black">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Video Skeleton */}
              <Card className="border-0 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="relative">
                  <Skeleton className="w-full aspect-video" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/50" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Play, color: 'sky' },
                  { icon: Clock, color: 'amber' },
                  { icon: BookOpen, color: 'indigo' },
                  { icon: Users, color: 'emerald' },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="border-0 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden"
                  >
                    <CardContent className="p-5">
                      <div
                        className={`w-11 h-11 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-3`}
                      >
                        <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                      </div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-7 w-12" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Description Skeleton */}
              <Card className="border-0 rounded-2xl shadow-lg shadow-slate-200/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Chapters Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <Card className="border-0 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100"
                      >
                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-4/5" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-2 w-20 rounded-full" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button Skeleton */}
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Loading Indicator Overlay */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100">
            <div className="relative">
              <div className="w-6 h-6 border-3 border-sky-200 rounded-full" />
              <div className="absolute inset-0 w-6 h-6 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Loading course</p>
              <p className="text-xs text-slate-500">Please wait a moment...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 flex items-center justify-center p-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-20" />
        </div>

        <Card className="relative border-0 rounded-3xl shadow-2xl shadow-slate-900/10 max-w-lg w-full overflow-hidden">
          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

          <CardContent className="p-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>

            <Button
              onClick={getCourseInfo}
              size="lg"
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl px-8 py-6 shadow-xl shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty State
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex items-center justify-center p-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-30" />
        </div>

        <Card className="relative border-0 rounded-3xl shadow-2xl shadow-slate-900/10 max-w-lg w-full overflow-hidden">
          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

          <CardContent className="p-10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">Course Not Found</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We couldn't find the course you're looking for. It may have been moved or deleted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="rounded-xl px-6 py-6 border-2 hover:bg-slate-50 transition-all duration-300"
              >
                Go Back
              </Button>
              <Button
                size="lg"
                onClick={getCourseInfo}
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl px-6 py-6 shadow-xl shadow-sky-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <CourseInfo course={data} />
}

export default PageClient
