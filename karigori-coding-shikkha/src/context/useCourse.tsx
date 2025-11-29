'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface CourseDataFromSource {
  bannerImage: string
  category: string
  cid: string
  courseId: string | null
  courseJson: any
  userEmail: string
}

interface CourseStats {
  totalLessons: number
  completedLessons: number
  totalChapters: number
  totalDuration: number
  completionPercentage: number
  level: string
  lastUpdated: string
  language: string
}

interface CourseContextProps {
  courseData: CourseDataFromSource | null
  setCourseData: (data: CourseDataFromSource) => void

  // Progress
  courseStats: CourseStats
  isLessonComplete: (lessonId: string) => boolean
  markLessonComplete: (lessonId: string) => void
  getChapterProgress: (chapterIndex: number) => {
    total: number
    completed: number
    percentage: number
    isComplete: boolean
  }
  clearProgress: () => void

  // Bookmarks
  isBookmarked: boolean
  toggleBookmark: () => void

  // Selected course state
  selectedCourse: CourseDataFromSource | null
  setSelectedCourse: (course: CourseDataFromSource | null) => void
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined)

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseData, setCourseData] = useState<CourseDataFromSource | null>(null)

  // Progress
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  // Bookmark
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Selected course
  const [selectedCourse, setSelectedCourse] = useState<CourseDataFromSource | null>(null)

  // Load progress + bookmark
  useEffect(() => {
    if (!courseData) return

    const cid = courseData.cid

    const savedProgress = localStorage.getItem(`progress-${cid}`)
    const savedBookmark = localStorage.getItem(`bookmark-${cid}`)

    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress))
    }
    if (savedBookmark === 'true') {
      setIsBookmarked(true)
    }
  }, [courseData])

  const saveProgress = (lessons: string[]) => {
    if (!courseData) return
    localStorage.setItem(`progress-${courseData.cid}`, JSON.stringify(lessons))
  }

  const markLessonComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return
    const updated = [...completedLessons, lessonId]
    setCompletedLessons(updated)
    saveProgress(updated)
  }

  const isLessonComplete = (lessonId: string) => completedLessons.includes(lessonId)

  const clearProgress = () => {
    setCompletedLessons([])
    if (courseData) {
      localStorage.removeItem(`progress-${courseData.cid}`)
    }
  }

  const toggleBookmark = () => {
    const newState = !isBookmarked
    setIsBookmarked(newState)

    if (courseData) {
      localStorage.setItem(`bookmark-${courseData.cid}`, newState ? 'true' : 'false')
    }
  }

  // -------- Course Stats Calculation --------
  const calculateStats = (): CourseStats => {
    if (!courseData?.courseJson) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        totalChapters: 0,
        totalDuration: 0,
        completionPercentage: 0,
        level: 'Beginner',
        lastUpdated: 'Recently',
        language: 'English',
      }
    }

    const json = courseData.courseJson

    const chapters = json.chapters || []
    const totalChapters = chapters.length
    const totalLessons = chapters.reduce(
      (sum: number, ch: any) => sum + (ch.videoUrls?.length || 0),
      0
    )

    const totalDuration = json.totalDuration || Math.floor(totalLessons * 0.5)

    const percentage = totalLessons ? Math.round((completedLessons.length / totalLessons) * 100) : 0

    return {
      totalChapters,
      totalLessons,
      completedLessons: completedLessons.length,
      totalDuration,
      completionPercentage: percentage,
      level: json.level || 'Beginner',
      lastUpdated: json.updatedAt || 'Recently',
      language: json.language || 'English',
    }
  }

  const courseStats = calculateStats()

  const getChapterProgress = (chapterIndex: number) => {
    if (!courseData?.courseJson) return { total: 0, completed: 0, percentage: 0, isComplete: false }

    const chapter = courseData.courseJson.chapters[chapterIndex]
    const total = chapter.videoUrls?.length || 0

    let completed = 0
    for (let i = 0; i < total; i++) {
      if (completedLessons.includes(`${chapterIndex}-${i}`)) {
        completed++
      }
    }

    const percentage = total ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      percentage,
      isComplete: percentage === 100,
    }
  }

  return (
    <CourseContext.Provider
      value={{
        courseData,
        setCourseData,
        courseStats,
        isLessonComplete,
        markLessonComplete,
        getChapterProgress,
        clearProgress,
        isBookmarked,
        toggleBookmark,
        selectedCourse,
        setSelectedCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

// Hook
export const useCourse = () => {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourse must be used inside <CourseProvider>')
  return ctx
}
