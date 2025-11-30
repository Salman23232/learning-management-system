'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AddNewCourseDialog from './AddNewCourse'
import { useUser } from '@clerk/nextjs'
import { useUserCourses } from '@/context/UserCoursesContext'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  Sparkles,
  Zap,
  Target,
  Award,
  TrendingUp,
  Star,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import cogImg from '../../../../public/assets/cog.png'
import cylinderImg from '../../../../public/assets/cylinder.png'
import pyramidImg from '../../../../public/assets/pyramid.png'

const CourseList = () => {
  const { courses, refreshCourses } = useUserCourses()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return
    setLoading(true)
    const fetchCourses = async () => {
      await refreshCourses()
      setLoading(false)
    }
    fetchCourses()
  }, [user?.primaryEmailAddress?.emailAddress, refreshCourses])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
        <div className="container mx-auto p-8 flex items-center justify-center min-h-[500px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-gray-600 font-semibold text-lg">Loading your courses...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,_#183EC2,_#EAEEFE_100%)]">
      <div className="container mx-auto p-6 lg:p-10 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex relative flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight ">
                  Your Courses
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  Manage and access all your created courses
                </p>
              </motion.div>
              {/* Decorative Images */}
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
                  className="absolute left-[40rem] -top-75 w-48 h-48 md:w-64 md:h-64"
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
            </div>
            {courses.length > 0 && (
              <AddNewCourseDialog>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 h-13 font-semibold rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create New Course
                  </Button>
                </motion.div>
              </AddNewCourseDialog>
            )}
          </div>

          {/* Stats Cards - Only show when there are courses */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            ></motion.div>
          )}
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {courses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="border-0 bg-white shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                <CardContent className="p-12 md:p-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="relative inline-block mb-8"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl"
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Start Your Learning Journey
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
                      Create your first AI-powered course in minutes. Build engaging content, track
                      progress, and achieve your learning goals.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
                    {[
                      {
                        icon: Zap,
                        text: 'AI-Powered Content',
                        bg: 'bg-blue-50',
                        icon_color: 'text-blue-600',
                      },
                      {
                        icon: Target,
                        text: 'Personalized Learning',
                        bg: 'bg-purple-50',
                        icon_color: 'text-purple-600',
                      },
                      {
                        icon: Award,
                        text: 'Track Your Progress',
                        bg: 'bg-green-50',
                        icon_color: 'text-green-600',
                      },
                    ].map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className={`${feature.bg} p-5 rounded-2xl border border-gray-100`}
                      >
                        <feature.icon className={`w-8 h-8 ${feature.icon_color} mx-auto mb-2`} />
                        <p className="text-sm font-semibold text-gray-700">{feature.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  <AddNewCourseDialog>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-12 h-16 font-bold text-lg rounded-2xl"
                      >
                        <PlayCircle className="w-6 h-6 mr-3" />
                        Create Your First Course
                        <Sparkles className="w-5 h-5 ml-3" />
                      </Button>
                    </motion.div>
                  </AddNewCourseDialog>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {courses.map((course, index) => {
                const courseData = course?.courseJson
                return (
                  <motion.div
                    key={course.cid}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <Link href={`/dashboard/course/${course?.cid}`} className="group block h-full">
                      <Card className="group relative border-0 bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden h-full rounded-2xl">
                        <div className="relative overflow-hidden">
                          <Image
                            src={course.bannerImage || '/default-course-banner.jpg'}
                            alt={courseData?.courseName}
                            width={500}
                            height={280}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                            priority={index < 3}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-xs font-bold text-gray-900 rounded-xl shadow-lg border border-white/50">
                              {course.category}
                            </span>
                          </div>

                          {/* Action Button */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-2xl flex items-center justify-center">
                              <ArrowRight className="w-5 h-5 text-gray-900" />
                            </div>
                          </motion.div>
                        </div>

                        <CardHeader className="p-6 pb-4">
                          <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                            {courseData.courseName}
                          </CardTitle>
                          {courseData.description && (
                            <CardDescription className="text-gray-600 line-clamp-2 leading-relaxed">
                              {courseData.description}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <CardContent className="p-6 pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-gray-700">
                                  {courseData.duration || '2h 30m'}
                                </span>
                              </div>
                            </div>
                            {courseData.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold text-gray-900">
                                  {courseData.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        {/* Bottom accent line */}
                        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CourseList
