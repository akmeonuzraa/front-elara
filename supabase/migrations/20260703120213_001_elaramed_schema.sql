/*
# elaraMed Database Schema

1. New Tables
- `chat_sessions` - Stores chat conversation sessions with the Claude chatbot
- `chat_messages` - Individual messages within each chat session (user and assistant)
- `symptom_predictions` - Records symptom prediction results with confidence scores
- `mri_analyses` - Stores MRI image analysis results with disclaimers

2. Security
- RLS enabled on all tables
- Anonymous and authenticated users can read/write all data (single-tenant app, no sign-in required)

3. Important Notes
- All tables use UUID primary keys with gen_random_uuid()
- Timestamps track creation times for audit trails
- MRI analyses include disclaimer text in every record for safety
- Symptom predictions store the selected symptoms as JSON array for flexibility
*/

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text DEFAULT 'Nouvelle conversation'
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Symptom predictions table
CREATE TABLE IF NOT EXISTS symptom_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  predicted_specialty text NOT NULL,
  confidence_score decimal(5,4) NOT NULL,
  top_alternatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_diseases jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- MRI analyses table
CREATE TABLE IF NOT EXISTS mri_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_filename text NOT NULL,
  predicted_class text NOT NULL,
  confidence_score decimal(5,4) NOT NULL,
  disclaimer text NOT NULL DEFAULT 'Outil pédagogique à but de démonstration — ne remplace pas un avis médical professionnel.',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mri_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions (anonymous access)
DROP POLICY IF EXISTS "anon_select_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_select_chat_sessions" ON chat_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_insert_chat_sessions" ON chat_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_update_chat_sessions" ON chat_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_delete_chat_sessions" ON chat_sessions FOR DELETE
  TO anon, authenticated USING (true);

-- Policies for chat_messages (anonymous access)
DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);

-- Policies for symptom_predictions (anonymous access)
DROP POLICY IF EXISTS "anon_select_symptom_predictions" ON symptom_predictions;
CREATE POLICY "anon_select_symptom_predictions" ON symptom_predictions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_symptom_predictions" ON symptom_predictions;
CREATE POLICY "anon_insert_symptom_predictions" ON symptom_predictions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Policies for mri_analyses (anonymous access)
DROP POLICY IF EXISTS "anon_select_mri_analyses" ON mri_analyses;
CREATE POLICY "anon_select_mri_analyses" ON mri_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mri_analyses" ON mri_analyses;
CREATE POLICY "anon_insert_mri_analyses" ON mri_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_symptom_predictions_created_at ON symptom_predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mri_analyses_created_at ON mri_analyses(created_at DESC);