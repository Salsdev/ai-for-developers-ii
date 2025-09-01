export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string;
          title: string;
          description: string;
          created_by: string;
          created_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          created_by: string;
          created_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          created_by?: string;
          created_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          poll_id: string;
          user_id: string;
          option_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          user_id: string;
          option_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          user_id?: string;
          option_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Utility types
export type Poll = Database["public"]["Tables"]["polls"]["Row"];
export type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];

export type InsertPoll = Database["public"]["Tables"]["polls"]["Insert"];
export type InsertPollOption =
  Database["public"]["Tables"]["poll_options"]["Insert"];
export type InsertVote = Database["public"]["Tables"]["votes"]["Insert"];

export type UpdatePoll = Database["public"]["Tables"]["polls"]["Update"];
export type UpdatePollOption =
  Database["public"]["Tables"]["poll_options"]["Update"];
export type UpdateVote = Database["public"]["Tables"]["votes"]["Update"];
