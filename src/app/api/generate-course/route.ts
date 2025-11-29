// src/app/api/generate-course/route.ts
import { NextRequest, NextResponse } from 'next/server'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('Missing OPENROUTER_API_KEY')

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// ----------------------------------------
// Fallback text models
// ----------------------------------------
const FALLBACK_TEXT_MODELS = [
  'x-ai/grok-4.1-fast',
  'x-ai/grok-4.1-fast:free',
  'qwen/qwen3-coder:free',
  'z-ai/glm-4.5-air:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'alibaba/tongyi-deepresearch-30b-a3b:free',
  'meituan/longcat-flash-chat:free',
  'kwaipilot/kat-coder-pro:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'tngtech/deepseek-r1t2-chimera:free',
  'tngtech/deepseek-r1t-chimera:free',
]

// Pick the first working model
const pickModel = () => FALLBACK_TEXT_MODELS[0]

export async function POST(req: NextRequest) {
  try {
    const { name, description, category, level } = await req.json()

    // ------------------------
    // 1) Ask AI for Course JSON

    const aiRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: pickModel(),
        messages: [
          {
            role: 'system',
            content: `
Return ONLY JSON. Follow this EXACT structure:

{
  "courseId": "string",
  "courseName": "string",
  "description": "string",
  "category": "string",
  "level": "string",
  "bannerImagePrompt": "string",
  "createdAt": "string",
  "totalDuration": "number",
  "chapters": [
    {
      "chapterTitle": "string",
      "videoSearchKeyword": "string",
      "lessons": [
        {
          "lessonTitle": "string"
        }
      ],
      "videoUrls": []
    }
  ]
}
expample
{
  "courseId": "python-intermediate-001",
  "courseName": "Full Python Course for intermidate student",
  "description": "python",
  "category": "python",
  "level": "intermediate",
  "bannerImagePrompt": "Vibrant banner for intermediate Python course featuring glowing code snippets, a stylized python snake, abstract data structures, and programming icons on a dark gradient background",
  "createdAt": "2025-11-23T16:08:16.377Z",
  "totalDuration": 0,
  "chapters": [
    {
      "chapterTitle": "Object-Oriented Programming",
      "videoSearchKeyword": "intermediate python oop classes inheritance",
      "lessons": ["Classes and Objects","Inheritance and Polymorphism","Encapsulation and Abstraction"],
      "videoUrls": ["https://www.youtube.com/watch?v=iLRZi0Gu8Go","https://www.youtube.com/watch?v=e4fwY9ZsxPw","https://www.youtube.com/watch?v=yFLY0SVutgM"]
    },
    {
      "chapterTitle": "Advanced Data Structures",
      "videoSearchKeyword": "python intermediate data structures lists dicts sets",
      "lessons": ["Advanced Lists and Dictionaries","Sets and Tuples","Comprehensions"],
      "videoUrls": ["https://www.youtube.com/watch?v=gOMW_n2-2Mw","https://www.youtube.com/watch?v=R-HLU9Fl5ug","https://www.youtube.com/watch?v=m9n2f9lhtrw"]
    }
  ]
}
`,
          },
          {
            role: 'user',
            content: `Course Name: ${name}
Description: ${description}
Category: ${category}
Level: ${level}
Return ONLY JSON.`,
          },
        ],
      }),
    })

    const aiJson = await aiRes.json()
    const raw = aiJson.choices?.[0]?.message?.content
    if (!raw) throw new Error('AI returned no content')

    const course = JSON.parse(raw)

    // ----------------------------------------
    // 2) Fetch YouTube videos for each chapter
    // ----------------------------------------
    for (const chap of course.chapters) {
      const query = chap.videoSearchKeyword || `${category} ${chap.chapterTitle} ${level} tutorial`

      chap.videoUrls = await searchYoutube(query)
    }

    // Final Metadata
    course.createdAt = new Date().toISOString()
    course.totalDuration = 0

    return NextResponse.json({ success: true, data: course })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

// ----------------------------------------------------------
// YouTube Search Helper
// ----------------------------------------------------------
async function searchYoutube(query: string) {
  try {
    const KEY = process.env.YOUTUBE_API_KEY
    if (!KEY) return []

    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: '3',
      key: KEY,
    })

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)

    const json = await res.json()

    return json.items?.map((i: any) => `https://www.youtube.com/watch?v=${i.id.videoId}`)
  } catch {
    return []
  }
}
