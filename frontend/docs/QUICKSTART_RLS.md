# Quick Start: RLS Setup Reference

## ✅ Status: COMPLETED

The RLS policies have been successfully set up! This document serves as a reference for what was done.

---

## 📋 What Was Set Up

## 📋 What Was Set Up

The SQL from `setup-rls-policies.sql` created 4 RLS policies for the `startup_ideas` table:

1. **INSERT Policy** - Users can only insert their own ideas
2. **SELECT Policy** - Users can only view their own ideas  
3. **UPDATE Policy** - Users can only update their own ideas
4. **DELETE Policy** - Users can only delete their own ideas

### The Policies Created

```sql
-- User can only insert if user_id matches their auth.uid()
CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas FOR INSERT
WITH CHECK (user_id = auth.uid());

-- User can only see their own ideas
CREATE POLICY "Allow users to view their own ideas"
ON startup_ideas FOR SELECT
USING (user_id = auth.uid());

-- User can only update their own ideas
CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User can only delete their own ideas
CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas FOR DELETE
USING (user_id = auth.uid());
```

---

## ✅ Verification

Check if policies are active in Supabase:
1. Go to **Authentication** → **Policies**
2. Find the `startup_ideas` table
3. You should see 4 policies listed

Or run in SQL Editor:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'startup_ideas';
```

---

## 🚀 Next: Test Your Code

Now test that everything works:

```bash
# Run the test
cd E:\AI-startup-validator\ai-insight-hub
npx tsx src/test/testIdeaInsert.ts
```

**Expected:** Success ✓ (or error with code other than 42501)

---

## 📚 Reference Files

For more information:
- **Full Guide:** `docs/RLS_POLICIES_GUIDE.md` - Deep dive into RLS
- **SQL Script:** `docs/setup-rls-policies.sql` - The actual policies
- **Archive:** `docs/diagnose-startup-ideas.sql` - Diagnostic tool (if needed)
