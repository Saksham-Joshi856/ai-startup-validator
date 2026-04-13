# Supabase Documentation

This folder contains guides and scripts for configuring Supabase Row-Level Security (RLS) policies.

## 📄 Files in This Folder

### ✅ **Active Files** (Currently Used)

#### 1. **setup-rls-policies.sql** ✓ COMPLETED
- **Status:** Successfully executed
- **What it did:** Created 4 RLS policies for startup_ideas table
- **Contains:** Active RLS policies (INSERT, SELECT, UPDATE, DELETE)
- **Reference:** Keep for records and future reference

#### 2. **RLS_POLICIES_GUIDE.md**
- **For:** Understanding how RLS works
- **Contains:** 
  - Detailed explanation of each policy
  - How RLS secures data
  - Troubleshooting guide
  - Best practices
- **Best if:** You want to understand the security model
- **Read time:** 15 minutes

### 📦 **Archive Files** (No Longer Needed)

#### 3. **setup-rls-policies-alternatives.sql** (DEPRECATED)
- **Why kept:** Reference only - shows alternative solutions if main setup failed
- **Status:** ⏸️ Not needed (main setup succeeded)
- **Use case:** Only if you need to switch column types

#### 4. **diagnose-startup-ideas.sql** (DEPRECATED)  
- **Why kept:** Reference only - for diagnostics
- **Status:** ⏸️ Not needed (diagnosis completed)
- **Use case:** Only if you get new errors in the future

---

## 🚀 Getting Started

### ✅ Setup Complete! You're Done With RLS

The RLS policies have been successfully created. Here's what's been set up:

1. ✓ **INSERT Policy** - Users can only insert their own ideas
2. ✓ **SELECT Policy** - Users can only view their own ideas
3. ✓ **UPDATE Policy** - Users can only update their own ideas
4. ✓ **DELETE Policy** - Users can only delete their own ideas

### What's Next?

- **Test your code:** Run `src/test/testIdeaInsert.ts` to verify everything works
- **Understand RLS:** Read `RLS_POLICIES_GUIDE.md` (15 minutes)
- **Use the API:** Start using your auth functions in your app:
  ```typescript
  // Sign up creates a profile automatically
  const { user, error } = await signUp(email, password);
  
  // Insert ideas (protected by RLS)
  const { data, error } = await createStartupIdea(userId, title, description);
  ```

### If You Get Errors Later

If you encounter new errors:
1. Check `RLS_POLICIES_GUIDE.md` troubleshooting section
2. Run `diagnose-startup-ideas.sql` for diagnostics
3. Review `setup-rls-policies.sql` to see what policies are active

---

## 🎯 What These Documents Solve

**Problem:** 
```
Error: new row violates row-level security policy for table "startup_ideas"
Code: 42501
```

**Solution:** Configure RLS policies following these guides.

---

## 📋 Quick Reference

| Question | Answer | File |
|----------|--------|------|
| How do I fix the RLS error? | Follow QUICKSTART | QUICKSTART_RLS.md |
| What SQL should I run? | Copy this file | setup-rls-policies.sql |
| Why does RLS exist? | Read this guide | RLS_POLICIES_GUIDE.md |
| How do I verify it worked? | Check Supabase Policies tab | QUICKSTART_RLS.md |

---

## ✅ Verification Checklist

### Setup Status
- [x] Opened Supabase SQL Editor
- [x] Ran SQL from setup-rls-policies.sql
- [x] Saw success message after execution
- [x] Checked **Authentication** → **Policies** in Supabase
- [x] See 4 policies listed for `startup_ideas` table

### Next: Test Your Code
- [ ] Run `src/test/testIdeaInsert.ts`
- [ ] Verify it returns success (not error 42501)
- [ ] Try creating an idea through your app
- [ ] Verify you can only see/edit your own ideas

---

## 🆘 Need Help?

1. **Getting started?** → Read **QUICKSTART_RLS.md**
2. **Error still happening?** → Check troubleshooting in **RLS_POLICIES_GUIDE.md**
3. **Want to understand more?** → Read **RLS_POLICIES_GUIDE.md**
4. **Need raw SQL?** → Use **setup-rls-policies.sql**

---

## 📚 Related Files in Project

- `src/lib/supabaseClient.ts` - Supabase client setup
- `src/lib/auth.ts` - Authentication functions
- `src/lib/ideaService.ts` - Idea creation service
- `src/test/testIdeaInsert.ts` - Test file for idea insertion
- `src/test/testSupabaseInsert.ts` - Direct database test

---

**Created:** April 11, 2026  
**Last Updated:** April 11, 2026
