/*
  # Freelancer Excuse Generator - Database Schema

  ## Overview
  This migration creates the complete database schema for the Freelancer Excuse Generator app.
  It includes tables for storing excuses, user interactions, and user submissions.

  ## New Tables

  ### 1. `excuses`
  Stores all generated excuses with their metadata
  - `id` (uuid, primary key) - Unique identifier for each excuse
  - `tone` (text) - The tone type: 'funny', 'believable', or 'dramatic'
  - `excuse_text` (text) - The generated excuse in Egyptian Arabic
  - `excuse_tips` (text) - Fictional ethical communication tips
  - `likes_count` (integer) - Number of likes received
  - `shares_count` (integer) - Number of shares
  - `copies_count` (integer) - Number of times copied
  - `created_at` (timestamptz) - Timestamp of creation
  - `user_id` (uuid, nullable) - Optional user identifier for tracking

  ### 2. `interactions`
  Tracks all user interactions with excuses
  - `id` (uuid, primary key) - Unique identifier for each interaction
  - `excuse_id` (uuid, foreign key) - Reference to the excuse
  - `user_id` (uuid, nullable) - Optional user identifier
  - `interaction_type` (text) - Type: 'like', 'share', or 'copy'
  - `created_at` (timestamptz) - Timestamp of interaction

  ### 3. `user_submissions`
  Stores user-submitted excuses for potential future features
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, nullable) - Optional user identifier
  - `submission_text` (text) - The submitted excuse text
  - `status` (text) - Status: 'pending', 'approved', or 'rejected'
  - `created_at` (timestamptz) - Timestamp of submission

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Create policies for public read access to excuses
  - Create policies for authenticated interactions
  - Create indexes for optimal query performance

  ## Important Notes
  1. All tables use UUID for primary keys for better scalability
  2. Timestamps use timestamptz for proper timezone handling
  3. Default values ensure data integrity
  4. Foreign key constraints maintain referential integrity
  5. RLS policies are restrictive by default, then opened for legitimate use
*/

CREATE TABLE IF NOT EXISTS excuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tone text NOT NULL CHECK (tone IN ('funny', 'believable', 'dramatic')),
  excuse_text text NOT NULL,
  excuse_tips text NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_excuses_created_at ON excuses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_excuses_likes_count ON excuses(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_excuses_tone ON excuses(tone);
CREATE INDEX IF NOT EXISTS idx_interactions_excuse_id ON interactions(excuse_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at DESC);

ALTER TABLE excuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

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