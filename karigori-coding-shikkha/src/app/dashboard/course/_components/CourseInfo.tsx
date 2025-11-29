'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Clock,
  Video,
  Play,
  CheckCircle,
  Users,
  Star,
  GraduationCap,
  Download,
  Globe,
  Calendar,
  ChevronRight,
  FileText,
  Target,
  Shield,
  Share2,
  Bookmark,
  Sparkles,
  PlayCircle,
  Headphones,
  MonitorPlay,
  Zap,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Heart,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

// UI component imports
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { useCourseProgress } from '@/context/CourseProgressContext'
import cogImg from '../../../../../public/assets/cog.png'
import cylinderImg from '../../../../../public/assets/cylinder.png'
import pyramidImg from '../../../../../public/assets/pyramid.png'
import { slugify } from '@/lib/course-utils'
import { useCourse } from '@/context/useCourse'

interface CourseDataFromSource {
  bannerImage: string
  category: string
  cid: string
  courseId: string | null
  courseJson: any
  userEmail: string
}

const CourseInfo = ({ course }: { course: CourseDataFromSource }) => {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState(false)

  const {
    setCourseData,
    courseData,
    courseStats: stats,
    getChapterProgress,
    isLessonComplete,
    isBookmarked,
    toggleBookmark,
    clearProgress,
  } = useCourse()

  useEffect(() => {
    if (course) {
      setCourseData(course)
    }
  }, [course, setCourseData])

  if (!courseData) {
    return <LoadingState />
  }

  const data = courseData.courseJson

  const getThumbnail = (url: string) => {
    try {
      const videoId = url.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^#\&\?]*).*/)?.[1]
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/placeholder.jpg'
    } catch {
      return '/placeholder.jpg'
    }
  }

  const handleLessonClick = (chapterIndex: number, lessonIndex: number, title: string) => {
    const lessonSlug = slugify(title)
    router.push(`/dashboard/course/${courseData.cid}/lesson/${lessonSlug}`)
  }

  const handleStartLearning = () => {
    const firstChapter = data.chapters?.[0]
    const firstTitle = firstChapter?.lessons?.[0] || firstChapter?.chapterTitle || 'introduction'

    if (firstChapter?.videoUrls?.[0] && firstTitle) {
      handleLessonClick(0, 0, firstTitle)
    }
  }

  const handleContinueLearning = () => {
    // Find the first incomplete lesson
    for (let ci = 0; ci < (data.chapters?.length || 0); ci++) {
      const chapter = data.chapters[ci]
      for (let li = 0; li < (chapter.videoUrls?.length || 0); li++) {
        const lessonId = `${ci}-${li}`
        if (!isLessonComplete(lessonId)) {
          const title = chapter.lessons?.[li] || `Lesson ${li + 1}`
          handleLessonClick(ci, li, title)
          return
        }
      }
    }
    // All complete, go to first lesson
    handleStartLearning()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.courseName,
          text: data.description,
          url: window.location.href,
        })
      } catch {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const learningOutcomes = data.learningOutcomes ||
    data.chapters?.slice(0, 6).map((ch: any) => ch.chapterTitle) || [
      `Master core concepts of ${data.courseName}`,
      'Build practical projects and real-world applications',
      'Learn industry best practices and methodologies',
      'Gain hands-on experience with modern tools',
      'Develop problem-solving skills',
      'Create portfolio-worthy projects',
    ]

  const requirements = data.requirements || [
    'Basic understanding of the subject',
    'A computer with internet connection',
    'Willingness to learn and practice',
    'No prior experience required',
  ]

  const courseFeatures = [
    {
      icon: MonitorPlay,
      title: 'On-Demand Videos',
      desc: 'Learn at your own pace with high-quality lessons.',
      color: 'from-sky-500 to-cyan-500',
      bg: 'bg-sky-50',
    },
    {
      icon: Download,
      title: 'Downloadable Resources',
      desc: 'Keep key files & assets forever.',
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
    },
    {
      icon: GraduationCap,
      title: 'Certificate',
      desc: 'Showcase your new skills to the world.',
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: Headphones,
      title: 'Crisp Audio',
      desc: 'Clear, studio-level sound for easy listening.',
      color: 'from-orange-500 to-rose-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Shield,
      title: 'Lifetime Access',
      desc: 'Come back anytime, forever.',
      color: 'from-indigo-500 to-sky-500',
      bg: 'bg-indigo-50',
    },
    {
      icon: Zap,
      title: 'Fresh Updates',
      desc: 'New content, zero extra cost.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'from-emerald-500 to-teal-500'
      case 'intermediate':
        return 'from-amber-500 to-orange-500'
      case 'advanced':
        return 'from-rose-500 to-pink-500'
      default:
        return 'from-sky-500 to-indigo-500'
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 text-slate-900 antialiased">
        {/* Decorative Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl animate-pulse" />
          <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="relative h-[520px] md:h-[580px] lg:h-[640px]">
            {/* Banner Image */}
            <Image
              src={imageError ? '/placeholder-course.jpg' : course.bannerImage}
              alt={data.courseName}
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-soft-light">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.9'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto max-w-7xl px-6">
                <div className="max-w-3xl text-white space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    <Badge className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-md text-[11px] font-semibold uppercase tracking-[0.18em] px-3 py-1">
                      {course.category}
                    </Badge>
                    {data.featured && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 border-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 shadow-lg shadow-amber-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        Featured
                      </Badge>
                    )}
                    <Badge className="bg-black/30 hover:bg-black/40 text-white border-0 backdrop-blur-md text-xs px-3 py-1">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {stats.lastUpdated}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                    {data.courseName}
                  </h1>

                  {/* Description */}
                  <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                    {data.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 text-sm md:text-base text-white/90">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                          />
                        ))}
                      </div>
                      <span className="font-bold">5.0</span>
                      <span className="text-white/60">(128 reviews)</span>
                    </div>

                    <Separator orientation="vertical" className="h-5 bg-white/30 hidden sm:block" />

                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="font-semibold">
                        {stats.totalLessons > 0 ? `${stats.totalLessons * 50}+` : '500+'}
                      </span>
                      <span className="text-white/60">students</span>
                    </span>

                    <Separator orientation="vertical" className="h-5 bg-white/30 hidden sm:block" />

                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 md:w-5 md:h-5" />
                      {stats.language}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      size="lg"
                      className="group rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-8 py-6 text-base font-bold text-white shadow-[0_20px_60px_rgba(56,189,248,0.5)] hover:shadow-[0_25px_80px_rgba(99,102,241,0.6)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                      onClick={
                        stats.completedLessons > 0 ? handleContinueLearning : handleStartLearning
                      }
                    >
                      <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {stats.completedLessons > 0 ? 'Continue Learning' : 'Start Learning'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          variant="outline"
                          className={cn(
                            'rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-6 py-6 transition-all duration-300',
                            isBookmarked && 'bg-white/20 border-white/60'
                          )}
                          onClick={toggleBookmark}
                        >
                          <Heart
                            className={cn(
                              'w-5 h-5 mr-2 transition-all',
                              isBookmarked && 'fill-rose-500 text-rose-500 scale-110'
                            )}
                          />
                          {isBookmarked ? 'Saved' : 'Save'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isBookmarked ? 'Remove from saved courses' : 'Save for later'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-6 py-6 transition-all duration-300"
                          onClick={handleShare}
                        >
                          {copied ? (
                            <Check className="w-5 h-5 mr-2 text-emerald-400" />
                          ) : (
                            <Share2 className="w-5 h-5 mr-2" />
                          )}
                          {copied ? 'Copied!' : 'Share'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share this course</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <main className="bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] ">
          {/* Stats Cards */}
          <section className="container mx-auto max-w-7xl px-6 -mt-16 md:-mt-20 relative z-10 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  icon: Video,
                  label: 'Lessons',
                  value: stats.totalLessons,
                  gradient: 'from-sky-500 to-cyan-500',
                  shadow: 'shadow-sky-500/25',
                },
                {
                  icon: Clock,
                  label: 'Duration',
                  value: `${stats.totalDuration}h`,
                  gradient: 'from-violet-500 to-purple-500',
                  shadow: 'shadow-violet-500/25',
                },
                {
                  icon: BookOpen,
                  label: 'Modules',
                  value: stats.totalChapters,
                  gradient: 'from-emerald-500 to-teal-500',
                  shadow: 'shadow-emerald-500/25',
                },
                {
                  icon: Award,
                  label: 'Level',
                  value: stats.level,
                  gradient: getLevelColor(stats.level),
                  shadow: 'shadow-amber-500/25',
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className="group relative overflow-hidden border-0 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl md:rounded-3xl"
                >
                  <div
                    className={cn(
                      'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
                      item.gradient
                    )}
                    style={{ opacity: 0.03 }}
                  />
                  <CardContent className="relative p-5 md:p-7">
                    <div
                      className={cn(
                        'w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110',
                        item.gradient,
                        item.shadow
                      )}
                    >
                      <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs md:text-sm uppercase tracking-widest text-slate-500 font-medium">
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Decorative Images */}
            <Image
              src={cogImg}
              alt="cog"
              className="absolute -right-36 -top-20 w-48 h-48 md:w-64 md:h-64"
              priority
            />
            <Image
              src={cylinderImg}
              alt="cylinder"
              className="absolute -left-20 top-52 w-32 h-32 md:w-48 md:h-48"
              priority
            />
          </section>

          {/* Progress Section */}
          {stats.totalLessons > 0 && (
            <section className="container mx-auto max-w-7xl px-6 mb-12">
              <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-6 md:p-8 relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                          <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                        {stats.completionPercentage === 100 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                          Your Progress
                        </h3>
                        <p className="text-slate-400 text-sm md:text-base">
                          {stats.completedLessons === 0
                            ? "You haven't started yet. Begin your journey!"
                            : stats.completionPercentage === 100
                            ? "Congratulations! You've completed the course!"
                            : `${stats.totalLessons - stats.completedLessons} lessons remaining`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-4xl md:text-5xl font-bold text-white">
                          {stats.completionPercentage}%
                        </div>
                        <p className="text-slate-400 text-sm">
                          {stats.completedLessons} / {stats.totalLessons} lessons
                        </p>
                      </div>
                      {stats.completedLessons > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={clearProgress}
                          className="text-slate-400 hover:text-white hover:bg-white/10"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset Progress
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mt-6">
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative"
                        style={{ width: `${stats.completionPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg shadow-white/30 border-2 border-indigo-500 transition-all duration-700"
                      style={{ left: `calc(${Math.min(stats.completionPercentage, 97)}% - 12px)` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Main Content Grid */}
          <section className="container mx-auto max-w-7xl px-6 pb-20">
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Course Curriculum */}
                <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-4 text-xl md:text-2xl text-slate-900">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        Course Curriculum
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="gap-1.5 border-slate-200 bg-white text-slate-700 px-3 py-1.5"
                        >
                          <Video className="w-4 h-4 text-sky-500" />
                          {stats.totalLessons} lessons
                        </Badge>
                        <Badge
                          variant="outline"
                          className="gap-1.5 border-slate-200 bg-white text-slate-700 px-3 py-1.5"
                        >
                          <Clock className="w-4 h-4 text-amber-500" />
                          {stats.totalDuration}h total
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[700px]">
                      <div className="p-6 space-y-4">
                        <Accordion type="multiple" className="w-full space-y-4">
                          {data.chapters?.map((chapter: any, chapterIndex: number) => {
                            const chapterProgress = getChapterProgress(chapterIndex)
                            const isChapterDone = chapterProgress.isComplete

                            return (
                              <AccordionItem
                                key={chapterIndex}
                                value={`module-${chapterIndex}`}
                                className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                              >
                                <AccordionTrigger className="px-5 py-5 hover:no-underline data-[state=open]:bg-gradient-to-r data-[state=open]:from-slate-50 data-[state=open]:to-sky-50/50">
                                  <div className="flex items-center justify-between w-full pr-4 gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div
                                        className={cn(
                                          'w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md transition-all',
                                          isChapterDone
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30'
                                            : chapterProgress.percentage > 0
                                            ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sky-500/30'
                                            : 'bg-slate-100 text-slate-600'
                                        )}
                                      >
                                        {isChapterDone ? (
                                          <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                          chapterIndex + 1
                                        )}
                                      </div>
                                      <div className="text-left flex-1">
                                        <h3 className="text-base font-semibold text-slate-900">
                                          {chapter.chapterTitle || `Module ${chapterIndex + 1}`}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                          <Badge
                                            variant="secondary"
                                            className="text-xs bg-slate-100 text-slate-600 border-0"
                                          >
                                            {chapterProgress.total} lesson
                                            {chapterProgress.total !== 1 && 's'}
                                          </Badge>
                                          {chapterProgress.percentage > 0 && (
                                            <span
                                              className={cn(
                                                'text-xs font-semibold',
                                                isChapterDone ? 'text-emerald-600' : 'text-sky-600'
                                              )}
                                            >
                                              {chapterProgress.percentage}% complete
                                            </span>
                                          )}
                                        </div>
                                        {/* Mini Progress Bar */}
                                        <div className="mt-3 w-full max-w-[200px]">
                                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                              className={cn(
                                                'h-full rounded-full transition-all duration-500',
                                                isChapterDone
                                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                                              )}
                                              style={{ width: `${chapterProgress.percentage}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-5 pb-5 bg-gradient-to-b from-slate-50/50 to-white">
                                  <div className="space-y-3 pt-3">
                                    {chapter.videoUrls?.map((url: string, i: number) => {
                                      const lessonId = `${chapterIndex}-${i}`
                                      const title = chapter.lessons?.[i] || `Lesson ${i + 1}`
                                      const isWatched = isLessonComplete(lessonId)

                                      return (
                                        <div
                                          key={i}
                                          onClick={() => handleLessonClick(chapterIndex, i, title)}
                                          className={cn(
                                            'group relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer border',
                                            isWatched
                                              ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50'
                                              : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-md'
                                          )}
                                        >
                                          {/* Lesson Number/Check */}
                                          <div
                                            className={cn(
                                              'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all',
                                              isWatched
                                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                                : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700'
                                            )}
                                          >
                                            {isWatched ? (
                                              <CheckCircle className="w-5 h-5" />
                                            ) : (
                                              i + 1
                                            )}
                                          </div>

                                          {/* Thumbnail */}
                                          <div className="relative w-32 md:w-40 aspect-video rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow shrink-0">
                                            <Image
                                              src={getThumbnail(url)}
                                              alt={title}
                                              fill
                                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                <Play className="w-5 h-5 text-slate-900 ml-0.5" />
                                              </div>
                                            </div>
                                            {isWatched && (
                                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                              </div>
                                            )}
                                          </div>

                                          {/* Text */}
                                          <div className="flex-1 min-w-0">
                                            <h4
                                              className={cn(
                                                'text-sm md:text-base font-semibold line-clamp-2 transition-colors',
                                                isWatched
                                                  ? 'text-emerald-800'
                                                  : 'text-slate-900 group-hover:text-sky-800'
                                              )}
                                            >
                                              {title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1.5">
                                              <Badge
                                                variant="secondary"
                                                className="text-[10px] bg-slate-100/80 text-slate-500"
                                              >
                                                <Video className="w-3 h-3 mr-1" />
                                                Video
                                              </Badge>
                                            </div>
                                          </div>

                                          <ChevronRight
                                            className={cn(
                                              'w-5 h-5 shrink-0 transition-all group-hover:translate-x-1',
                                              isWatched
                                                ? 'text-emerald-500'
                                                : 'text-slate-400 group-hover:text-sky-500'
                                            )}
                                          />
                                        </div>
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

                {/* What You'll Learn */}
                <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-xl rounded-3xl relative">
                  <Image
                    src={pyramidImg}
                    alt="pyramid"
                    className="absolute -left-20 -top-25 w-40 h-40 md:w-56 md:h-56"
                    priority
                  />
                  <CardHeader className="px-6 py-6 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-4 text-xl md:text-2xl text-slate-900">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {learningOutcomes.slice(0, 6).map((outcome: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-slate-700 leading-relaxed">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Sticky Card */}
                <div className="lg:sticky lg:top-6">
                  {/* Course Features */}
                  <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden mb-6">
                    <CardHeader className="px-6 py-5 border-b border-slate-100">
                      <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        This Course Includes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {courseFeatures.map((feature, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]',
                              feature.bg
                            )}
                          >
                            <div
                              className={cn(
                                'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md',
                                feature.color
                              )}
                            >
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-slate-900">
                                {feature.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden mb-6">
                    <CardHeader className="px-6 py-5 border-b border-slate-100">
                      <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {requirements.map((req: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* CTA Card */}
                  <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-6 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

                      <div className="relative text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Ready to Start?</h3>
                        <p className="text-slate-400 text-sm">
                          Join {stats.totalLessons * 50}+ students already learning
                        </p>
                        <Button
                          size="lg"
                          className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold py-6 shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5"
                          onClick={
                            stats.completedLessons > 0
                              ? handleContinueLearning
                              : handleStartLearning
                          }
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          {stats.completedLessons > 0 ? 'Continue Learning' : 'Start Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </TooltipProvider>
  )
}

// Enhanced Loading State
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
    {/* Decorative Background */}
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-24 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
    </div>

    {/* Hero Skeleton */}
    <div className="relative h-[520px] md:h-[580px] overflow-hidden">
      <Skeleton className="absolute inset-0 bg-slate-200" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="max-w-3xl space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full bg-white/20" />
              <Skeleton className="h-7 w-28 rounded-full bg-white/20" />
            </div>
            <Skeleton className="h-14 w-full max-w-xl bg-white/20 rounded-xl" />
            <Skeleton className="h-6 w-full max-w-lg bg-white/20 rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-32 bg-white/20 rounded" />
              <Skeleton className="h-5 w-28 bg-white/20 rounded" />
              <Skeleton className="h-5 w-24 bg-white/20 rounded" />
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-14 w-48 rounded-2xl bg-white/20" />
              <Skeleton className="h-14 w-32 rounded-2xl bg-white/20" />
              <Skeleton className="h-14 w-32 rounded-2xl bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto max-w-7xl px-6 -mt-16 relative z-10">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 rounded-2xl md:rounded-3xl shadow-xl bg-white/95">
            <CardContent className="p-5 md:p-7 space-y-4">
              <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-2xl" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Skeleton */}
      <Card className="border-0 rounded-3xl shadow-xl bg-slate-900 mb-12">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-5">
              <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-700" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-40 bg-slate-700 rounded" />
                <Skeleton className="h-5 w-56 bg-slate-700 rounded" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-12 w-24 ml-auto bg-slate-700 rounded" />
              <Skeleton className="h-4 w-32 ml-auto bg-slate-700 rounded" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-6 rounded-full bg-slate-700" />
        </CardContent>
      </Card>

      {/* Content Grid Skeleton */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 pb-20">
        <div className="space-y-8">
          <Card className="border-0 rounded-3xl shadow-xl bg-white/95">
            <CardHeader className="px-6 py-6 border-b border-slate-100">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-1.5 w-48 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 rounded-3xl shadow-xl bg-white/95">
            <CardHeader className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    {/* Loading Toast */}
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100">
        <div className="relative">
          <div className="w-6 h-6 border-3 border-sky-200 rounded-full" />
          <div className="absolute inset-0 w-6 h-6 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Loading course</p>
          <p className="text-xs text-slate-500">Please wait...</p>
        </div>
      </div>
    </div>
  </div>
)

export default CourseInfo
