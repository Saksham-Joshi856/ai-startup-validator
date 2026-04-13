# API Documentation: /api/getAnalysis

## Overview
Endpoint for retrieving AI analysis data for a specific startup idea by its ID.

## Endpoint
```
GET /api/getAnalysis?ideaId=[UUID]
```

---

## Request

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ideaId` | string (UUID) | ✅ Yes | The UUID of the idea to get analysis for |

### Examples

```bash
# With ideaId
GET /api/getAnalysis?ideaId=550e8400-e29b-41d4-a716-446655440000

# Missing ideaId (error)
GET /api/getAnalysis
```

---

## Response

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "idea_id": "550e8400-e29b-41d4-a716-446655440000",
    "market_score": 85,
    "competition_score": 72,
    "feasibility_score": 88,
    "analysis_text": "The market for AI resume builders is large and growing. There is moderate competition but strong demand...",
    "created_at": "2026-04-12T10:30:02Z",
    "updated_at": "2026-04-12T10:30:02Z"
  }
}
```

### Missing Parameter Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Missing required parameter: ideaId"
}
```

### Not Found Response (404 Not Found)
```json
{
  "success": false,
  "error": "No analysis found for idea 550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Failed to fetch analysis: [Database error message]"
}
```

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Successfully retrieved analysis |
| `400` | Bad request - Missing parameter or database error |
| `404` | Not found - No analysis exists for this idea |
| `405` | Method not allowed (only GET is supported) |
| `500` | Internal server error |

---

## Analysis Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Analysis record ID |
| `idea_id` | UUID | Associated idea ID |
| `market_score` | integer (0-100) | Market opportunity score |
| `competition_score` | integer (0-100) | Competition level score |
| `feasibility_score` | integer (0-100) | Technical feasibility score |
| `analysis_text` | string | Detailed AI analysis text |
| `created_at` | timestamp | Analysis creation time |
| `updated_at` | timestamp | Last update time |

---

## Error Cases

### Missing ideaId Parameter (400)
```json
{
  "success": false,
  "error": "Missing required parameter: ideaId"
}
```
**Cause:** Query parameter `ideaId` not provided
**Solution:** Include `?ideaId=uuid` in request URL

### Analysis Not Found (404)
```json
{
  "success": false,
  "error": "No analysis found for idea [uuid]"
}
```
**Cause:** Idea exists but has no analysis yet
**Solution:** Create an analysis first via POST /api/analyzeIdea

### Database Error (400)
```json
{
  "success": false,
  "error": "Failed to fetch analysis: [error details]"
}
```
**Cause:** Database query failed
**Solution:** Check Supabase connection and table schema

---

## Usage Examples

### Using Fetch API
```typescript
const ideaId = '550e8400-e29b-41d4-a716-446655440000';

const response = await fetch(`/api/getAnalysis?ideaId=${ideaId}`);
const result = await response.json();

if (result.success) {
  const analysis = result.data;
  console.log(`Market Score: ${analysis.market_score}/100`);
  console.log(`Competition Score: ${analysis.competition_score}/100`);
  console.log(`Feasibility Score: ${analysis.feasibility_score}/100`);
  console.log(`Analysis:\n${analysis.analysis_text}`);
} else {
  console.error('Error:', result.error);
}
```

### Using React Hook
```typescript
import { useGetAnalysis } from '@/hooks/useGetAnalysis';

function AnalysisDetail({ ideaId }) {
  const { isLoading, error, analysis } = useGetAnalysis(ideaId);

  if (isLoading) return <p>Loading analysis...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!analysis) return <p>No analysis found</p>;

  return (
    <div>
      <h2>Analysis Results</h2>
      <p>Market: {analysis.market_score}/100</p>
      <p>Competition: {analysis.competition_score}/100</p>
      <p>Feasibility: {analysis.feasibility_score}/100</p>
      <p>{analysis.analysis_text}</p>
    </div>
  );
}
```

### Using cURL
```bash
curl -X GET "http://localhost:3000/api/getAnalysis?ideaId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
```

---

## Data Query Details

### Database Table: `idea_analysis`

**Columns Retrieved:**
- `id` (UUID) - Record ID
- `idea_id` (UUID) - Associated idea
- `market_score` (INT) - 0-100 score
- `competition_score` (INT) - 0-100 score
- `feasibility_score` (INT) - 0-100 score
- `analysis_text` (TEXT) - Detailed analysis
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Update time

**Query Filter:**
- `idea_id = [provided_ideaId]`

**Query Type:** `.single()` - Expects exactly one result

### Example SQL Query
```sql
SELECT id, idea_id, market_score, competition_score, feasibility_score, 
       analysis_text, created_at, updated_at
FROM idea_analysis
WHERE idea_id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## Performance

- **Typical Response Time:** 30-100ms
- **Database Index:** Uses existing `idx_idea_analysis_idea_id` index
- **Result:** Single record (0 or 1 match)

---

## Testing

Run the test file:
```bash
npx tsx src/test/testGetAnalysisAPI.ts
```

Expected output:
```
================================================================================
Testing /api/getAnalysis Endpoint
================================================================================

📋 Test 1: Call without ideaId parameter...
✅ Correctly returned validation error

📋 Test 2: Call with non-existent ideaId...
✅ Correctly returned not found error
```

---

## Response Object Structure

```typescript
interface GetAnalysisResponse {
  success: boolean;      // Whether request succeeded
  data?: AnalysisData;   // Analysis object (only if success=true)
  error?: string;        // Error message (only if success=false)
}

interface AnalysisData {
  id: string;                    // UUID
  idea_id: string;               // UUID
  market_score: number;          // 0-100
  competition_score: number;     // 0-100
  feasibility_score: number;     // 0-100
  analysis_text: string;         // Analysis text
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

---

## Related Files

- **Endpoint:** `src/api/getAnalysis.ts`
- **Hook:** `src/hooks/useGetAnalysis.ts`
- **Test:** `src/test/testGetAnalysisAPI.ts`
- **Analysis Service:** `src/services/analysisService.ts`

---

## Related Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyzeIdea` | POST | Create idea and generate analysis |
| `/api/getAnalysis` | GET | Retrieve existing analysis |
| `/api/getIdeas` | GET | List all user ideas |

---

## Future Enhancements

- [ ] Add analysis update endpoint (PUT)
- [ ] Add analysis deletion endpoint (DELETE)
- [ ] Add batch retrieval for multiple ideas
- [ ] Add analysis history/versioning
- [ ] Add comparison between analyses
- [ ] Cache frequently accessed analyses
