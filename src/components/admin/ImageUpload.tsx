import { useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

type ImageUploadProps = {
  onUploaded: (url: string) => void
}

export default function ImageUpload({ onUploaded }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Por favor selecciona una imagen' })
      return
    }

    setLoading(true)
    const filePath = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('images').upload(filePath, file)

    if (error) {
      toast({ title: 'Error subiendo imagen', description: error.message })
      setLoading(false)
      return
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    onUploaded(data.publicUrl)
    
    // Mostrar preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    toast({ title: 'Imagen subida correctamente' })
    setLoading(false)
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await upload(file)
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) await upload(file)
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          dragActive
            ? 'border-accent bg-accent/10'
            : 'border-white/30 bg-white/5 hover:bg-white/10'
        } p-8 text-center cursor-pointer`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        <div className="space-y-3">
          <Upload className={`mx-auto h-10 w-10 ${loading ? 'text-white/50' : 'text-accent'}`} />
          <div className="space-y-1">
            <p className="font-medium text-white">
              {loading ? 'Subiendo imagen...' : 'Arrastra la imagen aquí'}
            </p>
            <p className="text-sm text-muted-foreground">o</p>
            <Button
              type="button"
              variant="pink"
              size="sm"
              disabled={loading}
              className="mx-auto"
            >
              Elegir archivo
            </Button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-white/20">
          <img src={preview} alt="preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
    </div>
  )
}
