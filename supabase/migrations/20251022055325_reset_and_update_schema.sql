-- First, drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS user_submissions;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS excuses;

-- Recreate tables with updated schema
CREATE TABLE IF NOT EXISTS excuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tone text NOT NULL CHECK (tone IN ('funny', 'believable', 'dramatic')),
  excuse_text text NOT NULL,
  likes_count integer DEFAULT 0 NOT NULL,
  shares_count integer DEFAULT 0 NOT NULL,
  copies_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid
);

CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  excuse_id uuid NOT NULL REFERENCES excuses(id) ON DELETE CASCADE,
  user_id uuid,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'share', 'copy')),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  submission_text text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_excuses_created_at ON excuses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_excuses_likes_count ON excuses(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_excuses_tone ON excuses(tone);
CREATE INDEX IF NOT EXISTS idx_interactions_excuse_id ON interactions(excuse_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE excuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Anyone can view excuses"
  ON excuses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert excuses"
  ON excuses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update excuse counts"
  ON excuses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view interactions"
  ON interactions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert interactions"
  ON interactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view submissions"
  ON user_submissions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert submissions"
  ON user_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);