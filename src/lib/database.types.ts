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
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          system_prompt: string | null
          whatsapp_status: string | null
          greenapi_instance_id: string | null
          greenapi_token: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          system_prompt?: string | null
          whatsapp_status?: string | null
          greenapi_instance_id?: string | null
          greenapi_token?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          system_prompt?: string | null
          whatsapp_status?: string | null
          greenapi_instance_id?: string | null
          greenapi_token?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 