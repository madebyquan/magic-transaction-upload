export interface FileWithPreview extends File {
  preview?: string
}

export interface ExtractedData {
  stockTicker: string
  numberOfShares: number
  purchasePrice: number
  purchaseDate: string
  transactionType: 'buy' | 'sell'
} 