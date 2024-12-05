import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Test" }],
    })

    return NextResponse.json({ 
      success: true,
      message: 'OpenAI API key is working'
    })
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 