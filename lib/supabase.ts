import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Types for database tables
export interface ChatSession {
  id: string;
  created_at: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SymptomPrediction {
  id: string;
  symptoms: string[];
  predicted_specialty: string;
  confidence_score: number;
  top_alternatives: { specialty: string; score: number }[];
  related_diseases: { name: string; orphacode: string }[];
  created_at: string;
}

export interface MriAnalysis {
  id: string;
  image_filename: string;
  predicted_class: string;
  confidence_score: number;
  disclaimer: string;
  created_at: string;
}

// Create a singleton Supabase client for client-side usage
let supabaseInstance: SupabaseClient | null = null;

export const supabase = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  return supabaseInstance;
};
