/**
 * Create proper idea_analysis table with correct schema
 * Run this SQL in Supabase SQL Editor
 */

-- Drop existing table if needed (WARNING: This deletes all data!)
-- DROP TABLE IF EXISTS idea_analysis CASCADE;

-- Create idea_analysis table with proper schema
CREATE TABLE IF NOT EXISTS idea_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL UNIQUE,
  market_score INT NOT NULL CHECK (market_score >= 0 AND market_score <= 100),
  competition_score INT NOT NULL CHECK (competition_score >= 0 AND competition_score <= 100),
  feasibility_score INT NOT NULL CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE idea_analysis 
ADD CONSTRAINT fk_idea_analysis_idea_id 
FOREIGN KEY (idea_id) REFERENCES startup_ideas(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_idea_analysis_idea_id ON idea_analysis(idea_id);

-- Enable RLS on the table
ALTER TABLE idea_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for SELECT (users can view their own analyses)
CREATE POLICY "Allow users to view their own analyses"
ON idea_analysis
FOR SELECT
USING (
  idea_id IN (
    SELECT id FROM startup_ideas WHERE user_id = auth.uid()
  )
);

-- Create RLS policy for INSERT (through service account or authenticated user)
CREATE POLICY "Allow idea creation service to insert analyses"
ON idea_analysis
FOR INSERT
WITH CHECK (true);

-- Create RLS policy for UPDATE
CREATE POLICY "Allow updates to own analyses"
ON idea_analysis
FOR UPDATE
USING (
  idea_id IN (
    SELECT id FROM startup_ideas WHERE user_id = auth.uid()
  )
);

-- Create RLS policy for DELETE
CREATE POLICY "Allow deletion of own analyses"
ON idea_analysis
FOR DELETE
USING (
  idea_id IN (
    SELECT id FROM startup_ideas WHERE user_id = auth.uid()
  )
);

-- Verify table was created
SELECT * FROM information_schema.tables WHERE table_name = 'idea_analysis';
