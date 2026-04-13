-- ============================================================================
-- ⏸️ DEPRECATED - Not Needed (Alternative RLS Setup Scripts)
-- ============================================================================
--
-- Purpose: Contains alternative SQL for different column types
-- Status: The main setup (setup-rls-policies.sql) has succeeded
-- Keep For: Reference only - if you need to change column types in the future
--
-- ============================================================================

-- ============================================================================
-- OPTION 1: If user_id column is UUID type (Most Common) ✓ CORRECT FOR THIS PROJECT
-- ============================================================================
-- No casting needed! Both user_id and auth.uid() are UUID type
-- Use this option if diagnose script shows: data_type = "uuid"
--
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to view their own ideas"
ON startup_ideas
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas
FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- OPTION 2: If user_id column is TEXT/VARCHAR type (Alternative)
-- ============================================================================
-- Use this option if diagnose script shows: data_type = "character varying" or "text"
-- (Currently commented out - OPTION 1 is correct for this project)
--
-- ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow users to insert their own ideas"
-- ON startup_ideas
-- FOR INSERT
-- WITH CHECK (user_id = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to view their own ideas"
-- ON startup_ideas
-- FOR SELECT
-- USING (user_id = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to update their own ideas"
-- ON startup_ideas
-- FOR UPDATE
-- USING (user_id = auth.uid()::text)
-- WITH CHECK (user_id = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to delete their own ideas"
-- ON startup_ideas
-- FOR DELETE
-- USING (user_id = auth.uid()::text);

-- ============================================================================
-- OPTION 3: If you get "text = uuid" or "uuid = text" error (Alternative)
-- ============================================================================
-- Use this variant with explicit two-way casting if you're still getting errors
-- (Currently commented out - OPTION 1 is correct for this project)
--
-- ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow users to insert their own ideas"
-- ON startup_ideas
-- FOR INSERT
-- WITH CHECK (user_id::text = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to view their own ideas"
-- ON startup_ideas
-- FOR SELECT
-- USING (user_id::text = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to update their own ideas"
-- ON startup_ideas
-- FOR UPDATE
-- USING (user_id::text = auth.uid()::text)
-- WITH CHECK (user_id::text = auth.uid()::text);
-- 
-- CREATE POLICY "Allow users to delete their own ideas"
-- ON startup_ideas
-- FOR DELETE
-- USING (user_id::text = auth.uid()::text);

-- ============================================================================
-- How to use this file:
-- ============================================================================
-- 1. Run diagnose-startup-ideas.sql first to verify column types
-- 2. Look at the output for "data_type" of user_id column
-- 3. If uuid: Use OPTION 1 (already active above)
-- 4. If text: Uncomment OPTION 2 and comment out OPTION 1
-- 5. If you get type errors: Try OPTION 3
-- 6. Copy the active option
-- 7. Paste into Supabase SQL Editor
-- 8. Click Run
--
-- ============================================================================
