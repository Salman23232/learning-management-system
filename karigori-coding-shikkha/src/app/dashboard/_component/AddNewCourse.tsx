'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid'
import { saveCourseToDb } from '@/lib/action'
import { useRouter } from 'next/navigation'

export default function AddNewCourseDialog({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    level: '',
  })
  const { user } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const aigurulabimage = async (imagePrompt: string) => {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        width: 1024,
        height: 1024,
        input: imagePrompt,
        model: 'flux',
        aspectRatio: '16:9',
      }),
    })
    const data = await res.json()
    return data.image
  }

  const onHandleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onGenerate = async () => {
    try {
      setLoading(true)

      const courseRes = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await courseRes.json()

      if (!data.success || !data.data) {
        alert('Failed to generate course')
        return
      }

      const courseId = uuidv4()
      const bannerImage = await aigurulabimage(data.data.bannerImagePrompt)

      const saveResult = await saveCourseToDb({
        cid: courseId,
        name: formData.name,
        description: data.data.description || formData.description,
        level: data.data.level || formData.level,
        category: data.data.category || formData.category,
        totalDuration: data.data.totalDuration || 0,
        createdAt: data.data.createdAt || new Date().toISOString(),
        bannerImage,
        courseJson: data.data,
        userEmail: user?.primaryEmailAddress?.emailAddress || null,
      })

      if (!saveResult.success) return

      router.push(`/dashboard/course/${courseId}`)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-0 m-0 w-full h-[90vh] md:h-auto overflow-hidden rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col md:flex-row w-full h-full bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)]"
        >
          {/* RIGHT SIDE – Form */}
          <div className="w-full flex items-center justify-center p-8 relative z-20 bg-white/90 backdrop-blur-md">
            <div className="w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text uppercase tracking-tighter">
                  Create New Course
                </DialogTitle>
                <DialogDescription className="mt-2 text-[#010D3E]/70 text-base md:text-lg">
                  Fill in the course details and let AI generate the full course for you.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label>Course Name</Label>
                  <Input
                    placeholder="Course Name"
                    value={formData.name}
                    onChange={(e) => onHandleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Course Description (Optional)</Label>
                  <Textarea
                    placeholder="Course Description"
                    value={formData.description}
                    onChange={(e) => onHandleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Difficulty Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => onHandleInputChange('level', value)}
                  >
                    <SelectTrigger className="border border-[#D2DCFF] bg-white">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-[#D2DCFF]">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="Category (Separated by comma)"
                    value={formData.category}
                    onChange={(e) => onHandleInputChange('category', e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="w-full bg-black hover:bg-black/90 text-white rounded-lg flex items-center justify-center gap-2"
                  onClick={onGenerate}
                  disabled={loading || !formData.name || !formData.level}
                >
                  {loading ? 'Generating...' : 'Generate Course'}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
