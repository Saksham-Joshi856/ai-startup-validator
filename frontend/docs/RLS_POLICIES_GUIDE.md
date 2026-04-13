# Supabase Row-Level Security (RLS) Configuration Guide

## What is Row-Level Security (RLS)?

Row-Level Security is a database feature that restricts access to rows based on user identity and policies. It ensures that users can only access data they should be allowed to access.

**Why it matters:**
- Prevents unauthorized data access
- Protects user privacy
- Enforces business logic at the database level
- Essential for production applications

---

## Current RLS Issue

Your `startup_ideas` table has RLS enabled, but **no policies are configured to allow inserts**. This causes the error:

```
new row violates row-level security policy for table "startup_ideas"
(Code: 42501)
```

---

## Solution: Configure RLS Policies

### **Step 1: Access Supabase Dashboard**

1. Go to [https://supabase.com](https://supabase.com)
2. Login to your project
3. Navigate to your project
4. Go to **SQL Editor** (left sidebar)

---

### **Step 2A: Quick Setup (Development/Testing)**

If you're in early development and want to disable RLS temporarily:

1. Go to **Table Editor** → `startup_ideas`
2. Click the **RLS** toggle (top right) → Turn OFF
3. ⚠️ **Note:** This is NOT recommended for production

---

### **Step 2B: Recommended Setup (Best Practice)**

Copy and paste these SQL policies in **SQL Editor**:

```sql
-- Enable RLS on startup_ideas table
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to insert their own ideas
CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Policy 2: Allow users to view their own ideas
CREATE POLICY "Allow users to view their own ideas"
ON startup_ideas
FOR SELECT
USING (auth.uid()::text = user_id);

-- Policy 3: Allow users to update their own ideas
CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy 4: Allow users to delete their own ideas
CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas
FOR DELETE
USING (auth.uid()::text = user_id);
```

**Steps to execute:**
1. Open **SQL Editor** in Supabase Dashboard
2. Click **+ New Query**
3. Paste the SQL above
4. Click **Run** (or press Ctrl+Enter)
5. Confirm the execution

---

### **Step 3: Verify Policies Are Created**

In Supabase Dashboard:
1. Go to **Authentication** → **Policies** (left sidebar)
2. Find the `startup_ideas` table
3. You should see 4 policies listed:
   - `Allow users to insert their own ideas`
   - `Allow users to view their own ideas`
   - `Allow users to update their own ideas`
   - `Allow users to delete their own ideas`

---

## Understanding the Policies

### **Policy 1: INSERT**
```sql
CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);
```
- **What it does:** Allows authenticated users to insert new rows
- **Restriction:** The `user_id` in the insert must match the authenticated user's ID
- **Use case:** User can only create ideas for themselves

### **Policy 2: SELECT**
```sql
CREATE POLICY "Allow users to view their own ideas"
ON startup_ideas
FOR SELECT
USING (auth.uid()::text = user_id);
```
- **What it does:** Allows users to query/read rows
- **Restriction:** Users can only see their own ideas
- **Use case:** User can only view ideas they created

### **Policy 3: UPDATE**
```sql
CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```
- **What it does:** Allows users to modify rows
- **Restriction:** Users can only update their own ideas
- **Use case:** User can edit ideas they created

### **Policy 4: DELETE**
```sql
CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas
FOR DELETE
USING (auth.uid()::text = user_id);
```
- **What it does:** Allows users to delete rows
- **Restriction:** Users can only delete their own ideas
- **Use case:** User can remove ideas they created

---

## Testing the Policies

### **Test 1: Using Authenticated User**

Once policies are configured, run your test with an **authenticated user ID**:

```bash
# Update testIdeaInsert.ts with a real user UUID
npx tsx src/test/testIdeaInsert.ts
```

Expected result: ✓ Success

### **Test 2: Using Supabase Client Directly**

```bash
npx tsx src/test/testSupabaseInsert.ts
```

Update the UUID in the test file to a valid Supabase user UUID, then run.

Expected result: ✓ Success

---

## Advanced: Multi-User Policies

If you want to allow ideas to be publicly visible but only editable by the owner:

```sql
-- Allow users to view ALL ideas (not just their own)
CREATE POLICY "Allow public view of all ideas"
ON startup_ideas
FOR SELECT
USING (true);

-- But keep INSERT, UPDATE, DELETE restricted to owner
CREATE POLICY "Allow users to insert their own ideas"
ON startup_ideas
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to update their own ideas"
ON startup_ideas
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to delete their own ideas"
ON startup_ideas
FOR DELETE
USING (auth.uid()::text = user_id);
```

---

## Advanced: Admin Override

If you need admin access (bypass RLS):

```sql
-- Allow admins to bypass RLS (if you have an admin column)
CREATE POLICY "Admins can do anything"
ON startup_ideas
FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin'
);
```

---

## Troubleshooting

### **"operator does not exist: text = uuid"**
- **Cause:** Type mismatch between `user_id` column and `auth.uid()` function
- **Solution:** 
  1. Run `diagnose-startup-ideas.sql` to check your actual column type
  2. Use the correct option from `setup-rls-policies-alternatives.sql`
  3. Most common fix:
     ```sql
     -- Change from: auth.uid()::text = user_id
     -- Change to: user_id = auth.uid()::text
     -- Or: user_id::text = auth.uid()::text
     ```

### **"new row violates row-level security policy"**
- **Cause:** No INSERT policy exists or conditions not met
- **Solution:** Create INSERT policy using the SQL above

### **"permission denied for schema public"**
- **Cause:** User doesn't have schema privileges
- **Solution:** Grant privileges:
  ```sql
  GRANT ALL ON schema public TO authenticated;
  GRANT ALL ON all tables in schema public TO authenticated;
  ```

### **"auth.uid() is null"**
- **Cause:** User is not authenticated
- **Solution:** Sign up/login first before testing

---

## Summary

1. ✓ Go to Supabase SQL Editor
2. ✓ Copy and paste the policies from **Step 2B**
3. ✓ Execute the SQL
4. ✓ Verify policies appear in Authentication → Policies
5. ✓ Run tests with authenticated user ID
6. ✓ Test should now succeed

---

## Quick Reference

**Disable RLS (dev only):**
```sql
ALTER TABLE startup_ideas DISABLE ROW LEVEL SECURITY;
```

**Enable RLS:**
```sql
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
```

**View existing policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'startup_ideas';
```

**Drop a policy:**
```sql
DROP POLICY "policy_name" ON startup_ideas;
```

---

Need help? Let me know if you need:
- Custom RLS policies
- Debugging specific policy issues
- Integration with your authentication flow
