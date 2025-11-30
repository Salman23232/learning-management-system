'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Video,
  CheckCircle,
  ChevronRight,
  Clock,
  Play,
  BookOpen,
  Trophy,
  Sparkles,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useCourseProgress, CourseProgressProvider } from '@/context/CourseProgressContext'
import { useCourse } from '@/context/useCourse'

// ---------- UTIL ----------
const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// ---------- TYPES ----------
interface Chapter {
  chapterTitle?: string
  lessons?: string[]
  videoUrls: string[]
}

interface CourseJson {
  courseName: string
  description?: string
  chapters: Chapter[]
  totalDuration?: number
  level?: string
  language?: string
}

// ---------- MAIN INNER PAGE ----------
const LessonPageInner = () => {
  const params = useParams<{ courseId: string; lessonSlug: string }>()
  const router = useRouter()
  const { lessonSlug } = params

  const { selectedCourse } = useCourse()
  const { markLessonWatched, getLessonProgress, getTotalStats } = useCourseProgress()

  const courseData: CourseJson | null = selectedCourse?.courseJson || null

  // ---------- FIND CURRENT LESSON ----------
  const { currentChapterIndex, currentLessonIndex, currentVideoUrl, currentLessonTitle } =
    useMemo(() => {
      if (!courseData)
        return {
          currentChapterIndex: 0,
          currentLessonIndex: 0,
          currentVideoUrl: '',
          currentLessonTitle: '',
        }

      let chapterIdx = 0
      let lessonIdx = 0

      for (let ci = 0; ci < courseData.chapters.length; ci++) {
        const ch = courseData.chapters[ci]
        const lessons = ch.lessons || []

        for (let li = 0; li < lessons.length; li++) {
          if (slugify(lessons[li]) === lessonSlug) {
            chapterIdx = ci
            lessonIdx = li
          }
        }
      }

      const ch = courseData.chapters[chapterIdx]
      return {
        currentChapterIndex: chapterIdx,
        currentLessonIndex: lessonIdx,
        currentVideoUrl: ch?.videoUrls?.[lessonIdx] || '',
        currentLessonTitle: ch?.lessons?.[lessonIdx] || 'Lesson',
      }
    }, [courseData, lessonSlug])

  // ---------- STATS ----------
  const stats = useMemo(() => {
    if (!courseData)
      return {
        totalVideos: 0,
        totalChapters: 0,
        totalDuration: 0,
        watchedVideos: 0,
        progressPercentage: 0,
      }

    const derived = getTotalStats(courseData.chapters)
    return {
      ...derived,
      totalChapters: courseData.chapters.length,
      totalDuration: courseData.totalDuration || Math.ceil(derived.totalVideos * 0.25),
    }
  }, [courseData, getTotalStats])

  const navigateToLesson = (chapterIndex: number, lessonIndex: number, title: string) => {
    router.push(`/dashboard/course/${selectedCourse?.cid}/lesson/${slugify(title)}`)
  }

  const isCurrentLessonWatched = getLessonProgress(currentChapterIndex, currentLessonIndex)

  // ---------- LOADING ----------
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading your lesson...</p>
          <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
        </div>
      </div>
    )
  }

  // ---------- PAGE UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 border-0">
                  Currently Learning
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {courseData?.courseName}
              </h1>
              <p className="text-slate-500 max-w-2xl leading-relaxed">{courseData?.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <Video className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Lessons</p>
                  <p className="text-sm font-semibold text-slate-900">{stats.totalVideos}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-sm font-semibold text-slate-900">{stats.totalDuration}h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* VIDEO PANEL */}
          <div className="space-y-5">
            {/* Video Player */}
            <div className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
              <div className="relative w-full pt-[56.25%]">
                {currentVideoUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${currentVideoUrl.replace('watch?v=', 'embed/')}?rel=0`}
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="p-4 bg-white/10 rounded-full mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <p className="text-slate-300">No video available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Lesson Card */}
            <Card className="border-0 rounded-2xl bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl shadow-lg shadow-sky-500/30">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-sky-600 uppercase tracking-wide">
                        Now Playing
                      </p>
                      <h2 className="text-lg font-semibold text-slate-900 mt-0.5">
                        {currentLessonTitle}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Chapter {currentChapterIndex + 1} • Lesson {currentLessonIndex + 1}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className={cn(
                      'rounded-xl font-semibold transition-all duration-300 shadow-lg',
                      isCurrentLessonWatched
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-sky-500/30'
                    )}
                    disabled={isCurrentLessonWatched}
                    onClick={() => markLessonWatched(currentChapterIndex, currentLessonIndex)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isCurrentLessonWatched ? 'Completed!' : 'Mark as Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 rounded-xl">
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Your Progress</h3>
                      <p className="text-sm text-slate-400">
                        {stats.watchedVideos} of {stats.totalVideos} lessons completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.progressPercentage}%</div>
                    {stats.progressPercentage === 100 && (
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Sparkles className="w-3 h-3" />
                        Complete!
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${stats.progressPercentage}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-black/25 border-2 border-indigo-400 transition-all duration-500"
                    style={{ left: `calc(${Math.min(stats.progressPercentage, 98)}% - 8px)` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                </div>
                Course Content
              </h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                {stats.totalChapters} chapters
              </Badge>
            </div>

            <Card className="border-0 rounded-2xl bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
              <CardContent className="p-0">
                <ScrollArea className="h-[580px]">
                  <div className="p-3">
                    <Accordion type="multiple" defaultValue={[`chapter-${currentChapterIndex}`]}>
                      {courseData?.chapters.map((chapter, ci) => {
                        const total = chapter.videoUrls.length
                        const watched = chapter.videoUrls.filter((_, li) =>
                          getLessonProgress(ci, li)
                        ).length
                        const chapterProgress = total > 0 ? Math.round((watched / total) * 100) : 0

                        return (
                          <AccordionItem
                            key={ci}
                            value={`chapter-${ci}`}
                            className="border border-slate-100 rounded-xl mb-2 overflow-hidden data-[state=open]:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3 w-full">
                                <div
                                  className={cn(
                                    'relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all',
                                    watched === total
                                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                      : watched > 0
                                      ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                                      : 'bg-slate-100 text-slate-600'
                                  )}
                                >
                                  {watched === total ? <CheckCircle className="w-5 h-5" /> : ci + 1}
                                </div>

                                <div className="flex-1 text-left">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {chapter.chapterTitle || `Module ${ci + 1}`}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          'h-full rounded-full transition-all',
                                          watched === total ? 'bg-emerald-500' : 'bg-sky-500'
                                        )}
                                        style={{ width: `${chapterProgress}%` }}
                                      />
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                      {watched}/{total}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-1.5 pt-1">
                                {chapter.videoUrls.map((_, li) => {
                                  const title = chapter.lessons?.[li] || `Lesson ${li + 1}`
                                  const isCurr =
                                    ci === currentChapterIndex && li === currentLessonIndex
                                  const isWatched = getLessonProgress(ci, li)

                                  return (
                                    <button
                                      key={li}
                                      type="button"
                                      onClick={() => navigateToLesson(ci, li, title)}
                                      className={cn(
                                        'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200',
                                        isCurr
                                          ? 'bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-400 shadow-sm'
                                          : isWatched
                                          ? 'bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300'
                                          : 'bg-slate-50/50 border border-transparent hover:bg-slate-100 hover:border-slate-200'
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                                          isCurr
                                            ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/30'
                                            : isWatched
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white border border-slate-200 text-slate-600'
                                        )}
                                      >
                                        {isWatched ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : isCurr ? (
                                          <Play className="w-3.5 h-3.5" />
                                        ) : (
                                          li + 1
                                        )}
                                      </div>

                                      <p
                                        className={cn(
                                          'text-sm font-medium flex-1 line-clamp-2',
                                          isCurr
                                            ? 'text-sky-900'
                                            : isWatched
                                            ? 'text-emerald-800'
                                            : 'text-slate-700'
                                        )}
                                      >
                                        {title}
                                      </p>

                                      <ChevronRight
                                        className={cn(
                                          'w-4 h-4 shrink-0 transition-transform',
                                          isCurr
                                            ? 'text-sky-500 translate-x-0'
                                            : isWatched
                                            ? 'text-emerald-400'
                                            : 'text-slate-300 group-hover:translate-x-0.5'
                                        )}
                                      />
                                    </button>
                                  )
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- PAGE WRAPPER ----------
export default function LessonPage() {
  const params = useParams<{ courseId: string; lessonSlug: string }>()
  return (
    <CourseProgressProvider courseId={params.courseId}>
      <LessonPageInner />
    </CourseProgressProvider>
  )
}
