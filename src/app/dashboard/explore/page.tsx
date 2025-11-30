'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Video,
  Clock,
  Award,
  Search,
  Compass,
  BookOpen,
  Sparkles,
  TrendingUp,
  Users,
  Play,
  ChevronRight,
  Filter,
  Grid3X3,
  LayoutList,
  GraduationCap,
  Zap,
  Star,
  ArrowRight,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { getCommunityCourses } from '@/lib/action'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import cogImg from '../../../../public/assets/cog.png'
import cylinderImg from '../../../../public/assets/cylinder.png'
import PyramidImage from '../../../../public/assets/pyramid.png'
// ---------- TYPES ----------
interface Course {
  cid: string
  courseJson?: {
    courseName?: string
    description?: string
    chapters?: any[]
    totalDuration?: number
    level?: string
    language?: string
    category?: string
  }
  createdAt?: string
  author?: string
  bannerImage: string
}

// ---------- COURSE CARD ----------
interface CourseCardProps {
  course: Course
  index: number
  viewMode: 'grid' | 'list'
}

const gradients = [
  'from-sky-400 via-blue-500 to-indigo-500',
  'from-purple-400 via-violet-500 to-indigo-500',
  'from-pink-400 via-rose-500 to-red-500',
  'from-amber-400 via-orange-500 to-red-500',
  'from-emerald-400 via-teal-500 to-cyan-500',
  'from-indigo-400 via-purple-500 to-pink-500',
  'from-cyan-400 via-sky-500 to-blue-500',
  'from-rose-400 via-pink-500 to-purple-500',
]

const CourseCard: React.FC<CourseCardProps> = ({ course, index, viewMode }) => {
  const router = useRouter()
  const gradient = gradients[index % gradients.length]

  const totalLessons =
    course.courseJson?.chapters?.reduce(
      (sum: number, ch: any) => sum + (ch.videoUrls?.length || 0),
      0
    ) || 0
  const totalChapters = course.courseJson?.chapters?.length || 0
  const totalDuration = course.courseJson?.totalDuration || Math.ceil(totalLessons * 0.25)
  const level = course.courseJson?.level || 'Beginner'

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'advanced':
        return 'bg-rose-100 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  if (viewMode === 'list') {
    return (
      <Card
        className="border-0 rounded-2xl bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={() => router.push(`/dashboard/course/${course.cid}`)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Gradient Banner */}
            <div className={'relative w-full sm:w-48 h-32 sm:h-auto'}>
              <Image src={course.bannerImage} alt={course.cid} fill className="absolute" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                  {totalChapters} chapters
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {course.courseJson?.courseName || 'Untitled Course'}
                  </h2>
                  <Badge className={cn('shrink-0 border', getLevelColor(level))}>{level}</Badge>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {course.courseJson?.description || 'No description available'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Video className="w-4 h-4 text-sky-500" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{totalDuration}h</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 gap-1"
                >
                  View Course
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="group border-0 rounded-2xl bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => router.push(`/dashboard/course/${course.cid}`)}
    >
      <CardContent className="p-0">
        {/* Gradient Header */}
        <div className={'relative h-56'}>
          <div className="absolute inset-0 bg-black/10" />
          <Image alt={course.cid} src={course.bannerImage} fill />
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              className={cn(
                'border shadow-sm',
                level.toLowerCase() === 'beginner'
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : level.toLowerCase() === 'intermediate'
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-rose-500 text-white border-rose-400'
              )}
            >
              {level}
            </Badge>
          </div>

          {/* Chapters Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
              <BookOpen className="w-3 h-3 mr-1" />
              {totalChapters} chapters
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
            {course.courseJson?.courseName || 'Untitled Course'}
          </h2>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {course.courseJson?.description || 'No description available'}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-sky-100 rounded-lg">
                <Video className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{totalDuration}h</span>
            </div>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </CardContent>
    </Card>
  )
}

// ---------- SKELETON CARD ----------
const CourseCardSkeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <Skeleton className="w-full sm:w-48 h-32 sm:h-auto" />
            <div className="flex-1 p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="h-36 w-full" />
      <CardContent className="p-5 space-y-4">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

// ---------- FILTER TABS ----------
const categories = [
  { id: 'all', label: 'All Courses', icon: Grid3X3 },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'new', label: 'New', icon: Sparkles },
  { id: 'beginner', label: 'Beginner', icon: GraduationCap },
  { id: 'advanced', label: 'Advanced', icon: Zap },
]

// ---------- EXPLORE PAGE ----------
const ExplorePage = () => {
  const { user } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return

      setLoading(true)
      try {
        const res = await getCommunityCourses(user.primaryEmailAddress.emailAddress)
        setCourses(res as Course[])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user?.primaryEmailAddress?.emailAddress])

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    let result = courses

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (course) =>
          course.courseJson?.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseJson?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'beginner' || activeCategory === 'advanced') {
        result = result.filter(
          (course) => course.courseJson?.level?.toLowerCase() === activeCategory
        )
      }
      // Add more category logic as needed
    }

    return result
  }, [courses, searchQuery, activeCategory])

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
        {/* Decorative Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Search Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-14 w-full max-w-xl rounded-2xl" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-xl" />
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} viewMode="grid" />
            ))}
          </div>
        </div>

        {/* Loading Toast */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100">
            <div className="relative">
              <div className="w-5 h-5 border-2 border-sky-200 rounded-full" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-sm font-medium text-slate-600">Loading courses...</span>
          </div>
        </div>
      </div>
    )
  }

  // Empty State
  if (!courses.length) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)] relative flex items-center justify-center p-4">
        {/* Decorative Background */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 0.9,
            y: [0, -15, 0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute left-0 -top-5"
        >
          <Image src={cogImg} alt="cog" className="w-48 h-48 md:w-64 md:h-64" priority />
        </motion.div>

        {/* Floating Cylinder */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 0.9,
            y: [0, -15, 0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -right-0 bottom-24"
        >
          <Image src={cylinderImg} alt="cylinder" className="w-32 h-32 md:w-48 md:h-48" priority />
        </motion.div>
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 0.9,
            y: [0, -15, 0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -right-0 top-24"
        >
          <Image
            src={PyramidImage}
            alt="cylinder"
            className="w-32 absolute left-0  h-32 md:w-48 md:h-48"
            priority
          />
        </motion.div>

        <Card className="relative border-0 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Compass className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Courses Yet</h2>
            <p className="text-slate-500 mb-8">
              Be the first to create and share a course with the community!
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl px-8 shadow-lg shadow-sky-500/25"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)]">
      {/* Decorative Background */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 0.9,
          y: [0, -15, 0, -8, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Image
          src={cogImg}
          alt="cog"
          className="absolute left-0 -top-75 w-48 h-48 md:w-64 md:h-64"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 0.9,
          y: [0, -15, 0, -8, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Image
          src={cylinderImg}
          alt="cylinder"
          className="absolute -left-40 top-24 w-32 h-32 md:w-48 md:h-48"
          priority
        />
      </motion.div>

      <div className="relative container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 border-0">
                  Community
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                Explore Courses
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Discover amazing courses created by our community
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-2 bg-sky-100 rounded-xl">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Courses</p>
                  <p className="text-lg font-bold text-slate-900">{courses.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Community</p>
                  <p className="text-lg font-bold text-slate-900">Growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-2xl border-slate-200 bg-white shadow-sm text-base focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-lg',
                  viewMode === 'grid' &&
                    'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-lg',
                  viewMode === 'list' &&
                    'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
                )}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'rounded-xl transition-all duration-300',
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-0 shadow-lg shadow-sky-500/25'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                )}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredCourses.length}</span>{' '}
            courses
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear search
            </Button>
          )}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <Card className="border-0 rounded-2xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Course Grid/List */}
        <div
          className={cn(
            'gap-6 pb-8',
            viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
          )}
        >
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.cid} course={course} index={index} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
