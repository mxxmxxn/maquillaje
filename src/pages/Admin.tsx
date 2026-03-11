import { ExternalLink, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminAbout from '@/components/admin/AdminAbout'
import AdminGallery from '@/components/admin/AdminGallery'
import AdminHero from '@/components/admin/AdminHero'
import AdminServices from '@/components/admin/AdminServices'
import AdminTestimonials from '@/components/admin/AdminTestimonials'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'

export default function Admin() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Panel de administracion</h1>
            <p className="mt-1 text-sm text-muted-foreground">Edita el contenido publico de tu web desde esta pantalla.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <ExternalLink className="h-4 w-4" /> Ver web
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={async () => {
                await signOut()
                navigate('/login')
              }}
            >
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 md:grid-cols-5">
            <TabsTrigger value="hero">Principal</TabsTrigger>
            <TabsTrigger value="about">Sobre mi</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
          </TabsList>

          <div className="mt-6 glass-card p-6">
            <TabsContent value="hero"><AdminHero /></TabsContent>
            <TabsContent value="about"><AdminAbout /></TabsContent>
            <TabsContent value="gallery"><AdminGallery /></TabsContent>
            <TabsContent value="services"><AdminServices /></TabsContent>
            <TabsContent value="testimonials"><AdminTestimonials /></TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
