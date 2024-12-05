import { NextResponse } from 'next/server'
import { extractDataFromText } from '@/lib/openai'
import * as XLSX from 'xlsx'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file received' 
      }, { status: 400 })
    }

    // Determine file type and optimize processing
    let data = []
    
    if (file.type.startsWith('image/')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      // Optimize Vision API request
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract only the following from this image: stock ticker, number of shares, price, date, and transaction type (buy/sell). Format as JSON array." 
              },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:${file.type};base64,${base64}`,
                  detail: "low" // Use low detail for faster processing
                } 
              }
            ]
          }
        ],
        temperature: 0, // More precise responses
        max_tokens: 500, // Limit response size
        response_format: { type: "json_object" } // Force JSON response
      })

      const text = response.choices[0].message.content
      if (text) {
        const result = await extractDataFromText(text)
        if (result?.data) {
          data = result.data
        }
      }
    } 
    else if (file.type === 'text/csv' || file.type.includes('sheet')) {
      // Optimize CSV/Excel processing
      let text = ''
      
      if (file.type === 'text/csv') {
        text = await file.text()
      } else {
        // For Excel, read only first 100 rows
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { sheetRows: 100 })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        text = XLSX.utils.sheet_to_csv(firstSheet)
      }

      // Process in smaller chunks if text is large
      if (text.length > 5000) {
        const lines = text.split('\n')
        const header = lines[0]
        const chunks = lines.slice(1).reduce((acc, line, i) => {
          const chunkIndex = Math.floor(i / 20)
          if (!acc[chunkIndex]) acc[chunkIndex] = []
          acc[chunkIndex].push(line)
          return acc
        }, [] as string[][])

        // Process chunks in parallel
        const results = await Promise.all(
          chunks.map(chunk => 
            extractDataFromText([header, ...chunk].join('\n'))
          )
        )

        data = results.flatMap(result => result?.data || [])
      } else {
        const result = await extractDataFromText(text)
        if (result?.data) {
          data = result.data
        }
      }
    }
    else {
      return NextResponse.json({ 
        success: false, 
        error: 'Unsupported file type' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error: any) {
    console.error('Error processing file:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}