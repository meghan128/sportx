import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof window !== 'undefined' && import.meta.env.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (typeof window !== 'undefined' && import.meta.env.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using fallback storage.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types that match our existing schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          password: string
          name: string
          email: string
          profession: string
          specialization: string | null
          bio: string | null
          organization: string | null
          location: string | null
          profile_image: string | null
          contact_info: any | null
          social_links: any | null
          privacy_settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          username: string
          password: string
          name: string
          email: string
          profession: string
          specialization?: string | null
          bio?: string | null
          organization?: string | null
          location?: string | null
          profile_image?: string | null
          contact_info?: any | null
          social_links?: any | null
          privacy_settings?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          username?: string
          password?: string
          name?: string
          email?: string
          profession?: string
          specialization?: string | null
          bio?: string | null
          organization?: string | null
          location?: string | null
          profile_image?: string | null
          contact_info?: any | null
          social_links?: any | null
          privacy_settings?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: number
          title: string
          description: string
          date: string
          start_time: string
          end_time: string
          location: string | null
          type: string
          category: string
          cpd_points: number
          price: number
          max_attendees: number | null
          image: string | null
          accreditation_body: string
          created_at: string
          updated_at: string
        }
      }
      courses: {
        Row: {
          id: number
          title: string
          description: string
          instructor: string
          duration: string
          difficulty: string
          category: string
          cpd_points: number
          price: number
          image: string | null
          accreditation_body: string
          created_at: string
          updated_at: string
        }
      }
      // Add more tables as needed
    }
  }
}