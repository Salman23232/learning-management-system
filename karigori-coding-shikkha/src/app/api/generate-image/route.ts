import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const response = await axios.post('https://aigurulab.tech/api/generate-image', body, {
      headers: {
        'x-api-key': process.env.AI_GURU_LAB_API,
        'Content-Type': 'application/json',
      },
      maxRedirects: 5, // allow axios to follow redirects
    })

    return NextResponse.json(response.data)
  } catch (err) {
    console.error('AI Guru Lab API Error:', err.response?.data || err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
