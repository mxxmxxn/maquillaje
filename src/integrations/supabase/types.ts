export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type PublicRow<T> = {
  Row: T
  Insert: Partial<T>
  Update: Partial<T>
}

export interface Database {
  public: {
    Tables: {
      hero_settings: PublicRow<{
        id: string
        title: string
        subtitle: string
        tagline: string
        hero_image_url: string
      }>
      about_content: PublicRow<{
        id: string
        paragraph_1: string
        paragraph_2: string
        paragraph_3: string
        photo_url: string
        stat_1_number: number
        stat_1_label: string
        stat_2_number: number
        stat_2_label: string
        stat_3_number: number
        stat_3_label: string
      }>
      gallery_items: PublicRow<{
        id: string
        image_url: string
        category: string
        title: string
        description: string
        sort_order: number
      }>
      services: PublicRow<{
        id: string
        name: string
        description: string
        price: string
        icon: string
        category_id: string | null
        sort_order: number
      }>
      testimonials: PublicRow<{
        id: string
        name: string
        text: string
        rating: number
        service: string
        photo_url: string
      }>
    }
  }
}
