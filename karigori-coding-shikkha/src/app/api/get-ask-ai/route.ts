import { NextRequest, NextResponse } from 'next/server'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('Missing OPENROUTER_API_KEY')

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const FALLBACK_MODELS = [
  'x-ai/grok-4.1-fast',
  'x-ai/grok-4.1-fast:free',
  'qwen/qwen3-coder:free',
  'z-ai/glm-4.5-air:free',
  'openai/gpt-oss-20b:free',
]

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json()
    if (!message) {
      return NextResponse.json({ success: false, error: 'No message provided' }, { status: 400 })
    }

    const prompt =
      message +
      ` Please answer concisely in 1–2 sentences in ${
        language === 'bn' ? 'Bangla (বাংলা)' : 'English'
      }.`

    const aiRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FALLBACK_MODELS[0],
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    })

    const aiJson = await aiRes.json()
    const aiText = aiJson.choices?.[0]?.message?.content || 'No response from AI'

    return NextResponse.json({ success: true, text: aiText })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
