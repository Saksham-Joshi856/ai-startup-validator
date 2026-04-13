/**
 * SOLUTION: Recreate the idea_analysis table with correct schema
 * 
 * This script will manually create the correct table structure
 * Run the SQL commands in Supabase SQL Editor
 */

const sqlCommands = `
-- STEP 1: Drop existing table (this will delete any data!)
DROP TABLE IF EXISTS idea_analysis CASCADE;

-- STEP 2: Create the table with correct columns
CREATE TABLE idea_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL,
  market_score INTEGER NOT NULL CHECK (market_score >= 0 AND market_score <= 100),
  competition_score INTEGER NOT NULL CHECK (competition_score >= 0 AND competition_score <= 100),
  feasibility_score INTEGER NOT NULL CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- STEP 3: Create unique index on idea_id
CREATE UNIQUE INDEX idx_idea_analysis_idea_id ON idea_analysis(idea_id);

-- STEP 4: Create foreign key only if startup_ideas exists
ALTER TABLE idea_analysis
ADD CONSTRAINT fk_idea_analysis_idea_id
FOREIGN KEY (idea_id) REFERENCES startup_ideas(id) ON DELETE CASCADE;

-- STEP 5: Enable RLS (optional - disable if not needed)
ALTER TABLE idea_analysis ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS policy for INSERT (permissive during development)
CREATE POLICY "Allow insert to idea_analysis"
ON idea_analysis
FOR INSERT
WITH CHECK (true);

-- STEP 7: Create RLS policy for SELECT
CREATE POLICY "Allow select from idea_analysis"
ON idea_analysis
FOR SELECT
USING (true);

-- STEP 8: Verify table was created
SELECT * FROM information_schema.columns 
WHERE table_name = 'idea_analysis'
ORDER BY ordinal_position;
`;

console.log('='.repeat(80));
console.log('TABLE RECREATION SOLUTION');
console.log('='.repeat(80));
console.log('\n📋 Copy and paste the following SQL into Supabase SQL Editor:\n');
console.log(sqlCommands);
console.log('\n' + '='.repeat(80));
console.log('STEPS:');
console.log('1. Go to https://app.supabase.com');
console.log('2. Select your project');
console.log('3. Click "SQL Editor" in sidebar');
console.log('4. Click "+ New Query"');
console.log('5. Copy paste the SQL above');
console.log('6. Click "Run"');
console.log('7. Return here and run: npx tsx src/test/testPipeline.ts');
console.log('='.repeat(80));
