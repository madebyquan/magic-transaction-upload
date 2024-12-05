'use client'

import { ExtractedData } from '@/types'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DownloadButtonProps {
  data: ExtractedData[]
}

export default function DownloadButton({ data }: DownloadButtonProps) {
  const handleDownload = () => {
    // Convert data to CSV format
    const headers = ['Stock Ticker,Number of Shares,Purchase Price,Purchase Date,Transaction Type']
    const rows = data.map(row => 
      `${row.stockTicker},${row.numberOfShares},${row.purchasePrice},${row.purchaseDate},${row.transactionType}`
    )
    const csv = [...headers, ...rows].join('\n')
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `exported_data_${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      Download CSV
    </Button>
  )
} 