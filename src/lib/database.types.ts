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
          created_at: string
          user_id: string
          name: string
          company: string | null
          language: string
          prompt: string
          whatsapp_number: string
          greenapi_instance_id: string | null
          whatsapp_status: 'disconnected' | 'connected' | 'awaiting_scan' | 'authenticated' | 'auth_failed' | null
          whatsapp_qr: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          company?: string | null
          language: string
          prompt: string
          whatsapp_number: string
          greenapi_instance_id?: string | null
          whatsapp_status?: 'disconnected' | 'connected' | 'awaiting_scan' | 'authenticated' | 'auth_failed' | null
          whatsapp_qr?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          company?: string | null
          language?: string
          prompt?: string
          whatsapp_number?: string
          greenapi_instance_id?: string | null
          whatsapp_status?: 'disconnected' | 'connected' | 'awaiting_scan' | 'authenticated' | 'auth_failed' | null
          whatsapp_qr?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          image?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
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