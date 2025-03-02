export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string | null
          created_at: string
          id: number
          main: boolean
          uuid: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          main?: boolean
          uuid?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          main?: boolean
          uuid?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          description: string | null
          heading: string | null
          id: number
          ingredients: string | null
          itemType: string | null
          name: string | null
          phone: string | null
          price: number | null
          src: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          heading?: string | null
          id?: number
          ingredients?: string | null
          itemType?: string | null
          name?: string | null
          phone?: string | null
          price?: number | null
          src?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          heading?: string | null
          id?: number
          ingredients?: string | null
          itemType?: string | null
          name?: string | null
          phone?: string | null
          price?: number | null
          src?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string | null
          contents: Json | null
          created_at: string
          id: number
          name: string | null
          payMethod: string | null
          phone: string | null
          status: string | null
          totalPrice: number | null
          uuid: string | null
        }
        Insert: {
          address?: string | null
          contents?: Json | null
          created_at?: string
          id?: number
          name?: string | null
          payMethod?: string | null
          phone?: string | null
          status?: string | null
          totalPrice?: number | null
          uuid?: string | null
        }
        Update: {
          address?: string | null
          contents?: Json | null
          created_at?: string
          id?: number
          name?: string | null
          payMethod?: string | null
          phone?: string | null
          status?: string | null
          totalPrice?: number | null
          uuid?: string | null
        }
        Relationships: []
      }
      userdata: {
        Row: {
          created_at: string
          id: number
          paymethod: string | null
          phone: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          paymethod?: string | null
          phone?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          paymethod?: string | null
          phone?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      usernames: {
        Row: {
          created_at: string
          id: number
          username: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          username?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          username?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hello: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
