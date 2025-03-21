export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chatbots: {
        Row: {
          id: string
          user_id: string
          name: string
          prompt: string | null
          whatsapp_number: string | null
          greenapi_instance_id: string | null
          created_at: string
          company: string | null
          language: string | null
          whatsapp_status: string | null
          greenapi_instance_token: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          prompt?: string | null
          whatsapp_number?: string | null
          greenapi_instance_id?: string | null
          created_at?: string
          company?: string | null
          language?: string | null
          whatsapp_status?: string | null
          greenapi_instance_token?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          prompt?: string | null
          whatsapp_number?: string | null
          greenapi_instance_id?: string | null
          created_at?: string
          company?: string | null
          language?: string | null
          whatsapp_status?: string | null
          greenapi_instance_token?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 