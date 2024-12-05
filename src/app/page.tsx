'use client'

import { useState } from 'react'
import FileUploader from "@/components/FileUploader"
import DataTable from "@/components/DataTable"
import DownloadButton from "@/components/DownloadButton"
import { ExtractedData } from '@/types'

export default function Home() {
  const [tableData, setTableData] = useState<ExtractedData[]>([])

  const handleDataExtracted = (newData: ExtractedData[]) => {
    setTableData(prevData => [...prevData, ...newData])
  }

  return (
    <main className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">
          Magic transaction upload in seconds
        </h1>
        <p className="text-muted-foreground text-center">
          AI extract the data for you. No formatting needed.
        </p>
      </div>
      <FileUploader onDataExtracted={handleDataExtracted} />
      <div className="space-y-4">
        <DataTable data={tableData} />
        <div className="flex justify-end">
          <DownloadButton data={tableData} />
        </div>
      </div>
    </main>
  )
} 