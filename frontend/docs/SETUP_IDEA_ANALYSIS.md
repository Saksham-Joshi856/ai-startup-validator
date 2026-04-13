# Setup Guide: idea_analysis Table Schema

## Problem
The pipeline test failed because the `idea_analysis` table doesn't have the proper schema with the `analysis_text` column.

**Error:**
```
Could not find the 'analysis_text' column of 'idea_analysis' in the schema cache
```

---

## Solution

### Step 1: Go to Supabase
1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Click **SQL Editor** in the left sidebar
4. Click **+ New Query**

### Step 2: Create the Table
Copy and paste the SQL from [`docs/setup-idea-analysis-table.sql`](./setup-idea-analysis-table.sql)

The SQL creates:
- ✅ `idea_analysis` table with proper columns
- ✅ Foreign key relationship to `startup_ideas`
- ✅ Constraints for score ranges (0-100)
- ✅ Proper indexes for performance
- ✅ Row-Level Security (RLS) policies

### Step 3: Execute the Query
1. Click the blue **Run** button
2. Wait for success confirmation

### Step 4: Verify
Run this verification query:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'idea_analysis'
ORDER BY ordinal_position;
```

You should see these columns:
- `id` - UUID
- `idea_id` - UUID
- `market_score` - INTEGER
- `competition_score` - INTEGER
- `feasibility_score` - INTEGER
- `analysis_text` - TEXT ← **Important!**
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

---

## After Setup: Run the Pipeline Test

Once the table is created, run:
```bash
npx tsx src/test/testPipeline.ts
```

You should see successful output:
```
✅ Idea created successfully with ID: [uuid]
✅ Idea ID extracted: [uuid]
✅ AI analysis completed successfully
   Market Score: 8/10
   Competition Score: 6/10
   Feasibility Score: 7/10
✅ Analysis stored successfully with ID: [uuid]
```

---

## Table Schema Details

### Columns

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique analysis ID |
| `idea_id` | UUID | UNIQUE, FOREIGN KEY | References startup_ideas.id |
| `market_score` | INT | 0-100 | Market opportunity score |
| `competition_score` | INT | 0-100 | Competition level score |
| `feasibility_score` | INT | 0-100 | Technical feasibility score |
| `analysis_text` | TEXT | NOT NULL | AI-generated analysis |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

### RLS Policies

The table includes 4 security policies:

1. **SELECT** - Users can view their own idea analyses
2. **INSERT** - Service can insert analyses (initially permissive)
3. **UPDATE** - Users can update their own analyses
4. **DELETE** - Users can delete their own analyses

---

## Troubleshooting

### Table already exists but columns are wrong
1. Go to Table Editor in Supabase
2. Click the **idea_analysis** table
3. Manually add missing columns, OR
4. Delete and recreate using the SQL script

### RLS Policy Issues
Temporarily disable RLS for testing:
```sql
ALTER TABLE idea_analysis DISABLE ROW LEVEL SECURITY;
```

Then re-enable after testing:
```sql
ALTER TABLE idea_analysis ENABLE ROW LEVEL SECURITY;
```

### Foreign Key Error
Make sure the `startup_ideas` table exists with proper schema:
```sql
SELECT * FROM startup_ideas LIMIT 1;
```

---

## Next Steps

After successful setup:
1. ✅ Run pipeline test: `npx tsx src/test/testPipeline.ts`
2. ✅ Verify idea and analysis are created
3. ✅ Check Supabase dashboard for records
4. ✅ Integrate with React UI components

---

## Files Referenced
- SQL Setup: [`docs/setup-idea-analysis-table.sql`](./setup-idea-analysis-table.sql)
- Service: [`src/services/analysisService.ts`](../src/services/analysisService.ts)
- Pipeline: [`src/services/ideaPipelineService.ts`](../src/services/ideaPipelineService.ts)
- Test: [`src/test/testPipeline.ts`](../src/test/testPipeline.ts)
