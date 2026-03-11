import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

type ImageUploadProps = {
  onUploaded: (url: string) => void
}

export default function ImageUpload({ onUploaded }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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
    toast({ title: 'Imagen subida correctamente' })
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <input type="file" accept="image/*" onChange={upload} className="text-sm" />
      <Button type="button" variant="outline" disabled={loading}>
        {loading ? 'Subiendo imagen...' : 'Subir imagen'}
      </Button>
    </div>
  )
}
