import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════
// Configuration & Types
// ═══════════════════════════════════════════════════════════════

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('🔴 Missing OPENROUTER_API_KEY environment variable')

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const FALLBACK_MODELS = [
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
  'tngtech/deepseek-r1-chimera:free',
]
const REQUEST_TIMEOUT = 30000 // 30 seconds

// What the frontend ultimately wants per question
export interface MCQQuestion {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface QuizExamPayload {
  quiz: MCQQuestion[]
  exam: MCQQuestion[]
}

interface GenerateQuizExamRequest {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  quizCount?: number
  examCount?: number
}

// ═══════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════

const pickModel = (): string => FALLBACK_MODELS[0]

const createSystemPrompt = (): string =>
  `
You are an expert educator and multiple-choice question generator.

Return ONLY valid JSON with NO markdown formatting, NO code blocks, and NO additional text.

EXACT JSON STRUCTURE REQUIRED:

{
  "quiz": [
    {
      "question": "Clear MCQ question text",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "answer": "Exact text of the correct option from the options array",
      "explanation": "Short explanation why this is the correct answer. Use \\n for line breaks."
    }
  ],
  "exam": [
    {
      "question": "Clear MCQ question text (typically more challenging / exam-style)",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "answer": "Exact text of the correct option from the options array",
      "explanation": "Short explanation. Use \\n for line breaks."
    }
  ]
}

CRITICAL RULES:
- "options" must be an array of 3–6 non-empty strings.
- "answer" MUST exactly match one of the strings in "options".
- "explanation" should be concise but informative and must be a string.
- Use \\n for line breaks inside strings.
- If asked to generate 0 quiz or 0 exam questions, return an empty array [] for that field.
- Return ONLY the JSON object. No explanations, no markdown.
`.trim()

const validateQuestion = (q: any, index: number, kind: 'quiz' | 'exam'): MCQQuestion => {
  if (!q || typeof q !== 'object') {
    throw new Error(`Invalid ${kind} question at index ${index}: not an object`)
  }

  const { question, options, answer, explanation } = q

  if (!question || typeof question !== 'string') {
    throw new Error(`Invalid ${kind} question at index ${index}: "question" must be a string`)
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new Error(`Invalid ${kind} question at index ${index}: "options" must be array of >= 2`)
  }

  if (!options.every((opt) => typeof opt === 'string' && opt.trim().length > 0)) {
    throw new Error(
      `Invalid ${kind} question at index ${index}: every option must be a non-empty string`
    )
  }

  if (!answer || typeof answer !== 'string') {
    throw new Error(`Invalid ${kind} question at index ${index}: "answer" must be a string`)
  }

  if (!options.includes(answer)) {
    throw new Error(
      `Invalid ${kind} question at index ${index}: "answer" must exactly match one of "options"`
    )
  }

  if (!explanation || typeof explanation !== 'string') {
    throw new Error(`Invalid ${kind} question at index ${index}: "explanation" must be a string`)
  }

  return { question, options, answer, explanation }
}

const validateQuizExamPayload = (
  data: any,
  quizCount: number,
  examCount: number
): QuizExamPayload => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid AI response: not an object')
  }

  const quizRaw = Array.isArray(data.quiz) ? data.quiz : []
  const examRaw = Array.isArray(data.exam) ? data.exam : []

  const quiz: MCQQuestion[] = quizRaw
    .slice(0, quizCount || quizRaw.length)
    .map((q: any, i: number) => validateQuestion(q, i, 'quiz'))

  const exam: MCQQuestion[] = examRaw
    .slice(0, examCount || examRaw.length)
    .map((q: any, i: number) => validateQuestion(q, i, 'exam'))

  return { quiz, exam }
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (err) {
    clearTimeout(id)
    throw err
  }
}

// ═══════════════════════════════════════════════════════════════
// Main API Handler
// ═══════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Step 1: Parse & Validate Request
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    let body: GenerateQuizExamRequest
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    const topic = (body.topic || '').trim()
    const difficulty = body.difficulty
    const quizCount = Number.isFinite(body.quizCount as number) ? body.quizCount! : 8
    const examCount = Number.isFinite(body.examCount as number) ? body.examCount! : 0

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          error: 'Topic is required and must be a non-empty string',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Difficulty must be one of: easy, medium, hard',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Step 2: Call AI API
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const aiRes = await fetchWithTimeout(
      OPENROUTER_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.get('referer') || 'https://localhost',
        },
        body: JSON.stringify({
          model: pickModel(),
          messages: [
            {
              role: 'system',
              content: createSystemPrompt(),
            },
            {
              role: 'user',
              content:
                `Generate ${quizCount} quiz-style multiple-choice questions ` +
                `and ${examCount} exam-style multiple-choice questions ` +
                `about "${topic}" at "${difficulty}" difficulty.\n` +
                `If quizCount or examCount is 0, return an empty array [] for that field.\n` +
                `Remember: return ONLY the JSON object matching the required structure.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      },
      REQUEST_TIMEOUT
    )

    if (!aiRes.ok) {
      const errorText = await aiRes.text()
      throw new Error(`AI API error (${aiRes.status}): ${errorText}`)
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Step 3: Parse & Validate AI Response
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const aiJson = await aiRes.json()
    const raw = aiJson.choices?.[0]?.message?.content

    if (!raw) {
      throw new Error('AI returned no content in response')
    }

    // Clean potential markdown formatting
    let cleanedContent = raw.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }

    let parsed: any
    try {
      parsed = JSON.parse(cleanedContent)
    } catch (parseErr: any) {
      throw new Error(`Failed to parse AI response as JSON: ${parseErr.message}`)
    }

    const quizExamData = validateQuizExamPayload(parsed, quizCount, examCount)

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Step 4: Success Response (match frontend expectations)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const duration = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        data: {
          quiz: quizExamData.quiz,
          exam: quizExamData.exam,
          difficulty,
          topic,
        },
        metadata: {
          model: pickModel(),
          topic,
          difficulty,
          quizCountRequested: quizCount,
          examCountRequested: examCount,
          quizCountReturned: quizExamData.quiz.length,
          examCountReturned: quizExamData.exam.length,
          generationTime: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Generation-Time': `${duration}ms`,
        },
      }
    )
  } catch (err: any) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Error Handling
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    console.error('❌ Quiz/Exam Generation Error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    })

    const isTimeout = err.name === 'AbortError'
    const statusCode = isTimeout ? 504 : 500

    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? 'Request timeout - AI took too long to respond'
          : err.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      { status: statusCode }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
export async function GET() {
  return NextResponse.json(
    {
      service: 'Quiz & Exam Generator API',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        generate: 'POST /api/generate-quiz-exam',
      },
      models: FALLBACK_MODELS,
    },
    { status: 200 }
  )
}
