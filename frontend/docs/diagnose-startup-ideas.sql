-- ============================================================================
-- ⏸️ DEPRECATED - Not Needed (Diagnostic Script for startup_ideas)
-- ============================================================================
--
-- Purpose: Check column types and RLS status
-- Status: Diagnosis completed - RLS policies successfully created
-- Keep For: Reference only - use if you encounter new errors
--
-- ============================================================================

-- Check the actual data types of columns in startup_ideas table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'startup_ideas'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables
WHERE tablename = 'startup_ideas';

-- Check existing policies on startup_ideas table
SELECT 
    policyname,
    schemaname,
    tablename,
    permissive,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'startup_ideas'
ORDER BY policyname;

-- ============================================================================
-- Expected output for user_id column should show:
-- column_name: user_id
-- data_type: uuid (or text/character varying)
--
-- This tells us the exact type to use in our RLS policies
-- ============================================================================
