// src/app/api/generate-problem/route.ts
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
  'tngtech/deepseek-r1t-chimera:free',
]
const REQUEST_TIMEOUT = 30000 // 30 seconds

interface StarterCode {
  javascript: string
  python: string
  java: string
  cpp: string
}

interface TestCase {
  input: string
  output: string
}

interface Problem {
  problemId: string
  title: string
  description: string
  starterCode: StarterCode
  testCases: TestCase[]
}

interface GenerateRequest {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// ═══════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════

const pickModel = (): string => FALLBACK_MODELS[0]

const createSystemPrompt = (): string =>
  `
You are an expert coding problem generator. Return ONLY valid JSON with NO markdown formatting, NO code blocks, NO additional text.

EXACT JSON STRUCTURE REQUIRED:
{
  "problemId": "unique-slug-identifier",
  "title": "Clear, Concise Problem Title",
  "description": "Detailed problem description with examples and constraints. Use \\n for line breaks.",
  "starterCode": {
    "javascript": "function solve() {\\n  // Your code here\\n}",
    "python": "def solve():\\n    # Your code here\\n    pass",
    "java": "public class Solution {\\n    public void solve() {\\n        // Your code here\\n    }\\n}",
    "cpp": "#include <iostream>\\nusing namespace std;\\n\\nvoid solve() {\\n    // Your code here\\n}"
  },
  "testCases": [
    {
      "input": "test input as string",
      "output": "expected output as string"
    }
  ]
}

CRITICAL: Return ONLY the JSON object. No explanations, no markdown.
`.trim()

const validateProblem = (data: any): Problem => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid problem format: not an object')
  }

  const required = ['problemId', 'title', 'description', 'starterCode', 'testCases']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  if (!Array.isArray(data.testCases) || data.testCases.length === 0) {
    throw new Error('testCases must be a non-empty array')
  }

  return data as Problem
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

    let body: GenerateRequest
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

    const { topic, difficulty } = body

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
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
              content: `Generate a ${difficulty} level coding problem about "${topic}". Return ONLY the JSON object with no additional text or formatting.`,
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

    let problem: Problem
    try {
      const parsed = JSON.parse(cleanedContent)
      problem = validateProblem(parsed)
    } catch (parseErr: any) {
      throw new Error(`Failed to parse AI response: ${parseErr.message}`)
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Step 4: Success Response
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const duration = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        data: problem,
        metadata: {
          model: pickModel(),
          difficulty,
          topic,
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

    console.error('❌ Problem Generation Error:', {
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
// Additional Endpoints (Optional)
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json(
    {
      service: 'Problem Generator API',
      version: '2.0.0',
      status: 'operational',
      endpoints: {
        generate: 'POST /api/generate-problem',
      },
      models: FALLBACK_MODELS,
    },
    { status: 200 }
  )
}
