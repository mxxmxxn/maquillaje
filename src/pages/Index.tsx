import { useEffect } from 'react'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import GallerySection from '@/components/GallerySection'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import ServicesSection from '@/components/ServicesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CustomCursor from '@/components/effects/CustomCursor'
import ScrollSection from '@/components/effects/ScrollSection'

export default function Index() {
  useEffect(() => {
    document.body.classList.add('cursor-none-enabled')
    return () => document.body.classList.remove('cursor-none-enabled')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <GallerySection />
        <ServicesSection />
        <TestimonialsSection />
        <ScrollSection effect="curtain" intensity={0.8}>
          <ContactSection />
        </ScrollSection>
      </main>
      <Footer />
    </div>
  )
}
