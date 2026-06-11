export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bot_settings: {
        Row: {
          chatbot_id: string | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          setting_type: Database["public"]["Enums"]["bot_setting_type"]
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_type: Database["public"]["Enums"]["bot_setting_type"]
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_type?: Database["public"]["Enums"]["bot_setting_type"]
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      chatbots: {
        Row: {
          ai_enabled: boolean
          business_hours: Json | null
          capabilities: Json
          company: string | null
          company_overview: string | null
          created_at: string
          custom_prompt: string | null
          flow: Json | null
          flow_timeout_hours: number
          flow_timeout_message: string | null
          greenapi_instance_id: string
          greenapi_instance_token: string | null
          greeting_message: string | null
          id: string
          is_active: boolean
          language: string | null
          language_prompt: string | null
          max_tokens: number
          model: string
          name: string
          provider: string
          public_token: string
          role_objective: string | null
          system_prompt: string | null
          temperature: number
          timezone: string
          updated_at: string
          user_id: string
          whatsapp_number: string
          whatsapp_status:
            | Database["public"]["Enums"]["whatsapp_connection_status"]
            | null
        }
        Insert: {
          ai_enabled?: boolean
          business_hours?: Json | null
          capabilities?: Json
          company?: string | null
          company_overview?: string | null
          created_at?: string
          custom_prompt?: string | null
          flow?: Json | null
          flow_timeout_hours?: number
          flow_timeout_message?: string | null
          greenapi_instance_id: string
          greenapi_instance_token?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean
          language?: string | null
          language_prompt?: string | null
          max_tokens?: number
          model?: string
          name: string
          provider?: string
          public_token?: string
          role_objective?: string | null
          system_prompt?: string | null
          temperature?: number
          timezone?: string
          updated_at?: string
          user_id: string
          whatsapp_number: string
          whatsapp_status?:
            | Database["public"]["Enums"]["whatsapp_connection_status"]
            | null
        }
        Update: {
          ai_enabled?: boolean
          business_hours?: Json | null
          capabilities?: Json
          company?: string | null
          company_overview?: string | null
          created_at?: string
          custom_prompt?: string | null
          flow?: Json | null
          flow_timeout_hours?: number
          flow_timeout_message?: string | null
          greenapi_instance_id?: string
          greenapi_instance_token?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean
          language?: string | null
          language_prompt?: string | null
          max_tokens?: number
          model?: string
          name?: string
          provider?: string
          public_token?: string
          role_objective?: string | null
          system_prompt?: string | null
          temperature?: number
          timezone?: string
          updated_at?: string
          user_id?: string
          whatsapp_number?: string
          whatsapp_status?:
            | Database["public"]["Enums"]["whatsapp_connection_status"]
            | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          blocked_at: string | null
          chat_id: string | null
          chatbot_id: string
          created_at: string
          flow_state: Json | null
          id: string
          is_blocked: boolean
          last_message_at: string | null
          name: string | null
          phone: string
        }
        Insert: {
          blocked_at?: string | null
          chat_id?: string | null
          chatbot_id: string
          created_at?: string
          flow_state?: Json | null
          id?: string
          is_blocked?: boolean
          last_message_at?: string | null
          name?: string | null
          phone: string
        }
        Update: {
          blocked_at?: string | null
          chat_id?: string | null
          chatbot_id?: string
          created_at?: string
          flow_state?: Json | null
          id?: string
          is_blocked?: boolean
          last_message_at?: string | null
          name?: string | null
          phone?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chatbot_id: string
          contact_id: string
          content: string
          created_at: string
          id: string
          media_url: string | null
          message_type: string
          provider_meta: Json | null
          role: string
        }
        Insert: {
          chatbot_id: string
          contact_id: string
          content?: string
          created_at?: string
          id?: string
          media_url?: string | null
          message_type?: string
          provider_meta?: Json | null
          role: string
        }
        Update: {
          chatbot_id?: string
          contact_id?: string
          content?: string
          created_at?: string
          id?: string
          media_url?: string | null
          message_type?: string
          provider_meta?: Json | null
          role?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          chatbot_id: string
          created_at: string
          currency: string | null
          description: string | null
          external_id: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          metadata: Json | null
          name: string
          price: number | null
          url: string | null
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          metadata?: Json | null
          name: string
          price?: number | null
          url?: string | null
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number | null
          url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: { created_at: string; email: string; google_id: string; id: string }
        Insert: { created_at?: string; email: string; google_id: string; id?: string }
        Update: { created_at?: string; email?: string; google_id?: string; id?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      get_public_bot: {
        Args: { p_token: string }
        Returns: { company: string; id: string; language: string; name: string }[]
      }
      get_public_contacts: {
        Args: { p_token: string }
        Returns: { id: string; last_message_at: string; name: string; phone: string }[]
      }
      get_public_messages: {
        Args: { p_contact: string; p_token: string }
        Returns: {
          content: string
          created_at: string
          id: string
          media_url: string
          message_type: string
          role: string
        }[]
      }
    }
    Enums: {
      bot_setting_type: "chat_summary"
      whatsapp_connection_status:
        | "disconnected"
        | "connected"
        | "awaiting_scan"
        | "authenticated"
        | "auth_failed"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]
export type Chatbot = PublicSchema["Tables"]["chatbots"]["Row"]
export type ChatbotInsert = PublicSchema["Tables"]["chatbots"]["Insert"]
export type ChatbotUpdate = PublicSchema["Tables"]["chatbots"]["Update"]
export type Contact = PublicSchema["Tables"]["contacts"]["Row"]
export type Message = PublicSchema["Tables"]["messages"]["Row"]
export type Product = PublicSchema["Tables"]["products"]["Row"]

export type BotCapabilities = {
  voice?: boolean
  image?: boolean
  scheduling?: boolean
  products?: boolean
}
