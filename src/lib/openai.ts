import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Transaction {
  stockTicker: string
  numberOfShares: number
  purchasePrice: number
  purchaseDate: string
  transactionType: string
}

// Get current date in local timezone at the start
const today = new Date()
const currentDate = today.getFullYear() + '-' + 
  String(today.getMonth() + 1).padStart(2, '0') + '-' + 
  String(today.getDate()).padStart(2, '0')

export async function extractDataFromText(text: string): Promise<any> {
  try {
    console.log('Input text for processing:', text)

    if (!text.trim()) {
      return { data: [] }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a financial data extractor. Extract transaction data from the following text and return it in a specific JSON format.
          
          Rules for extraction:
          1. If only shares and price are found, assume:
             - Transaction type is "Initial balance"
             - Date is ${currentDate} (today)
             - Stock ticker should be extracted or marked as "UNKNOWN"
          
          2. Numbers without units should be interpreted as:
             - Whole numbers are typically shares
             - Decimal numbers are typically prices
          
          3. Format all data as:
          {
            "data": [
              {
                "stockTicker": "string (stock symbol or 'UNKNOWN')",
                "numberOfShares": "number (quantity)",
                "purchasePrice": "number (price per share)",
                "purchaseDate": "string (use ${currentDate} if not found)",
                "transactionType": "string (use 'Initial balance' if only shares and price found, otherwise 'buy' or 'sell')"
              }
            ]
          }
          
          If you find any numbers, try to create a transaction record with defaults.
          Do not include any other text or explanation in your response.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0
    })

    const content = response.choices[0].message.content
    console.log('OpenAI Response:', content)

    if (!content) {
      return { data: [] }
    }

    try {
      const parsedData = JSON.parse(content.trim())
      
      // Validate and set defaults for each transaction
      if (parsedData.data && Array.isArray(parsedData.data)) {
        parsedData.data = parsedData.data.map((transaction: Partial<Transaction>) => ({
          stockTicker: transaction.stockTicker || 'UNKNOWN',
          numberOfShares: Number(transaction.numberOfShares) || 0,
          purchasePrice: Number(transaction.purchasePrice) || 0,
          purchaseDate: transaction.purchaseDate || currentDate,
          transactionType: transaction.transactionType || 'Initial balance'
        }))

        // Filter out invalid transactions
        parsedData.data = parsedData.data.filter((transaction: Transaction) => 
          transaction.numberOfShares > 0 && 
          transaction.purchasePrice > 0
        )
      }

      return parsedData

    } catch (parseError) {
      console.error('JSON Parse Error:', {
        error: parseError,
        content: content
      })
      return { data: [] }
    }

  } catch (error: any) {
    console.error('OpenAI Processing Error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      text: text
    })
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    
    throw new Error(
      error.response?.data?.error?.message || 
      error.message || 
      'Failed to process text with OpenAI'
    )
  }
}