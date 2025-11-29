'use client'

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'

interface ProgressState {
  [lessonId: string]: boolean // e.g., "0-0": true
}

interface CourseProgressContextType {
  courseId: string | null
  progress: ProgressState
  markLessonWatched: (chapterIndex: number, lessonIndex: number) => void
  getLessonProgress: (chapterIndex: number, lessonIndex: number) => boolean
  getTotalStats: (chapters: any[]) => {
    totalVideos: number
    watchedVideos: number
    progressPercentage: number
  }
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined)

export function CourseProgressProvider({
  courseId,
  children,
}: {
  courseId: string
  children: ReactNode
}) {
  const [progress, setProgress] = useState<ProgressState>({})

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!courseId) return
    try {
      const saved = localStorage.getItem(`videoProgress_${courseId}`)
      if (saved) {
        setProgress(JSON.parse(saved))
      } else {
        setProgress({})
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
      setProgress({})
    }
  }, [courseId])

  const saveProgress = (updatedProgress: ProgressState) => {
    if (courseId) {
      localStorage.setItem(`videoProgress_${courseId}`, JSON.stringify(updatedProgress))
    }
  }

  const markLessonWatched = (chapterIndex: number, lessonIndex: number) => {
    const lessonId = `${chapterIndex}-${lessonIndex}`
    setProgress((current) => {
      if (current[lessonId]) return current
      const updated = { ...current, [lessonId]: true }
      saveProgress(updated)
      return updated
    })
  }

  const getLessonProgress = (chapterIndex: number, lessonIndex: number): boolean => {
    const lessonId = `${chapterIndex}-${lessonIndex}`
    return !!progress[lessonId]
  }

  const getTotalStats = useMemo(() => {
    return (chapters: any[] = []) => {
      let totalVideos = 0
      let watchedVideos = 0

      chapters.forEach((ch, chapterIndex) => {
        const urls = ch.videoUrls || []
        totalVideos += urls.length
        urls.forEach((_: any, lessonIndex: number) => {
          if (progress[`${chapterIndex}-${lessonIndex}`]) {
            watchedVideos++
          }
        })
      })

      const progressPercentage =
        totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0

      return {
        totalVideos,
        watchedVideos,
        progressPercentage,
      }
    }
  }, [progress])

  const value = useMemo(
    () => ({
      courseId,
      progress,
      markLessonWatched,
      getLessonProgress,
      getTotalStats,
    }),
    [courseId, progress, markLessonWatched, getLessonProgress, getTotalStats]
  )

  return <CourseProgressContext.Provider value={value}>{children}</CourseProgressContext.Provider>
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext)
  if (!context) {
    throw new Error('useCourseProgress must be used within a CourseProgressProvider')
  }
  return context
}
