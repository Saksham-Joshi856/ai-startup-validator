-- ============================================================================
-- Supabase Row-Level Security (RLS) Setup Script for startup_ideas Table
-- ============================================================================
-- 
-- Copy and paste this entire script into Supabase SQL Editor and execute.
-- This will create all necessary policies for the startup_ideas table.
--
-- ============================================================================

-- Step 1: Enable RLS on the startup_ideas table
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;

-- Step 2: Create INSERT Policy
-- Allows authenticated users to insert ideas only if user_id matches their auth ID
CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Step 3: Create SELECT Policy
-- Allows authenticated users to view only their own ideas
CREATE POLICY "Allow users to view their own ideas"
ON startup_ideas
FOR SELECT
USING (user_id = auth.uid());

-- Step 4: Create UPDATE Policy
-- Allows authenticated users to update only their own ideas
CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Step 5: Create DELETE Policy
-- Allows authenticated users to delete only their own ideas
CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas
FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- Verification
-- ============================================================================
-- After running the above, verify policies were created by running:
-- SELECT * FROM pg_policies WHERE tablename = 'startup_ideas';
--
-- You should see 4 policies listed.
--
-- ============================================================================
-- (Optional) Additional Configurations
-- ============================================================================

-- OPTION A: Allow public read access (everyone can view all ideas)
-- Uncomment below if you want all users to see all ideas:
--
-- CREATE POLICY "Allow public view of all ideas"
-- ON startup_ideas
-- FOR SELECT
-- USING (true);

-- OPTION B: Grant necessary privileges to authenticated users
-- Run this if users get "permission denied for schema public" errors:
--
-- GRANT ALL ON schema public TO authenticated;
-- GRANT ALL ON all tables in schema public TO authenticated;
-- GRANT ALL ON all sequences in schema public TO authenticated;

-- ============================================================================
-- Disable RLS (DEVELOPMENT ONLY - NOT FOR PRODUCTION)
-- ============================================================================
-- If you want to disable RLS temporarily for testing:
--
-- ALTER TABLE startup_ideas DISABLE ROW LEVEL SECURITY;
--
-- ============================================================================
