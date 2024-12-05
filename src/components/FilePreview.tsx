import { X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { FileWithPreview } from '@/types'
import { cn } from '@/lib/utils'

interface FilePreviewProps {
  files: FileWithPreview[]
  onRemove: (index: number) => void
  processingStatus?: Record<string, string>
}

export default function FilePreview({ files, onRemove, processingStatus = {} }: FilePreviewProps) {
  return (
    <div className="grid gap-3">
      {files.map((file, index) => {
        const status = processingStatus[file.name]
        
        return (
          <div 
            key={file.name} 
            className={cn(
              "relative group flex items-center gap-3 p-2 rounded-lg",
              status?.includes('❌') && "bg-destructive/10",
              status?.includes('✅') && "bg-green-100 dark:bg-green-900/20",
              status?.includes('🔄') && "bg-blue-100 dark:bg-blue-900/20"
            )}
          >
            <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-muted">
              {file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground truncate">
                  {file.name}
                </p>
                {status && (
                  <div className="flex items-center gap-2 shrink-0">
                    {status.includes('🔄') ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : status.includes('✅') ? (
                      <span className="text-sm text-green-600">✓</span>
                    ) : status.includes('❌') ? (
                      <span className="text-sm text-destructive">×</span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )
} 