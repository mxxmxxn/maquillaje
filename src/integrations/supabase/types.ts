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
        description: string
        hero_image_url: string
      }>
      about_content: PublicRow<{
        id: string
        description: string
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
        sort_order: number
      }>
      services: PublicRow<{
        id: string
        name: string
        price: string
        category_id: string | null
        image_url: string
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
