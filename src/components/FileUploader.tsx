'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileWithPreview, ExtractedData } from '@/types'
import { Upload, Loader2 } from 'lucide-react'
import FilePreview from './FilePreview'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onDataExtracted: (data: ExtractedData[]) => void
}

export default function FileUploader({ onDataExtracted }: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processingStatus, setProcessingStatus] = useState<Record<string, string>>({})

  const processFiles = async (files: File[]) => {
    setIsProcessing(true)
    setProgress(0)
    setErrors({})
    setProcessingStatus({})

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      let abortController: AbortController | null = null

      try {
        setProcessingStatus(prev => ({
          ...prev,
          [file.name]: '📤 Preparing to upload...'
        }))

        const formData = new FormData()
        formData.append('file', file)

        abortController = new AbortController()

        setProcessingStatus(prev => ({
          ...prev,
          [file.name]: '🔄 Processing file...'
        }))

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: abortController.signal
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to process file')
        }

        const result = await response.json()
        console.log('🟢 [Frontend] Server response:', result)

        if (result.success && result.data) {
          onDataExtracted(result.data)
          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: `✅ Extracted ${result.data.length} transactions`
          }))
          setProgress(100)
          toast.success(`Successfully processed ${file.name}`, {
            description: `Extracted ${result.data.length} transactions`
          })
        } else {
          throw new Error(result.error || 'No data extracted')
        }

      } catch (error: any) {
        console.error('🔴 [Frontend] Error:', error)
        setErrors(prev => ({
          ...prev,
          [file.name]: error.message
        }))
        setProcessingStatus(prev => ({
          ...prev,
          [file.name]: '❌ Failed'
        }))
        toast.error(`Failed to process ${file.name}`, {
          description: error.message
        })
      } finally {
        if (abortController) {
          abortController.abort()
        }
      }
    }

    setIsProcessing(false)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    )
    setFiles(prevFiles => [...prevFiles, ...filesWithPreview])
    processFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.webp']
    },
    multiple: true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl 
              p-8
              transition-colors duration-200
              ${isDragActive 
                ? 'border-primary/70 bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="p-4 rounded-full bg-muted/50">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xl font-semibold">
                  Drop your broker screenshots or CSV here
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Supports CSV, Excel, and image files
                </div>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Uploaded Files ({files.length})
                </h3>
                <FilePreview 
                  files={files} 
                  processingStatus={processingStatus}
                  onRemove={(index) => {
                    const newFiles = [...files]
                    URL.revokeObjectURL(files[index].preview!)
                    newFiles.splice(index, 1)
                    setFiles(newFiles)
                    const fileName = files[index].name
                    setProcessingStatus(prev => {
                      const newStatus = { ...prev }
                      delete newStatus[fileName]
                      return newStatus
                    })
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors[fileName]
                      return newErrors
                    })
                  }} 
                />
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Overall Progress: {progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {Object.entries(errors).length > 0 && (
                <div className="space-y-2 p-4 bg-destructive/10 rounded-lg">
                  <p className="text-sm font-medium text-destructive">Errors:</p>
                  {Object.entries(errors).map(([fileName, error]) => (
                    <div key={fileName} className="text-sm text-destructive flex items-start gap-2">
                      <span className="font-medium break-all">{fileName}:</span>
                      <span className="flex-1">{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 