# API Documentation: /api/getIdeas

## Overview
Endpoint for retrieving all startup ideas for the currently authenticated user, ordered by creation date (newest first).

## Endpoint
```
GET /api/getIdeas
```

---

## Request

### Headers
```
Content-Type: application/json
```

### Query Parameters
None - The user is automatically determined from the session.

### Body
No request body needed for GET request.

---

## Response

### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "13664e05-7f8d-468b-8085-7016ac9acb82",
      "idea_text": "AI resume builder for job seekers",
      "industry": "HR Tech",
      "created_at": "2026-04-12T10:30:00Z",
      "updated_at": "2026-04-12T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "13664e05-7f8d-468b-8085-7016ac9acb82",
      "idea_text": "Marketplace for sustainable fashion",
      "industry": "E-commerce",
      "created_at": "2026-04-11T15:20:00Z",
      "updated_at": "2026-04-11T15:20:00Z"
    }
  ],
  "count": 2
}
```

### Unauthorized Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```

### Empty Result Response (200 OK)
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Failed to fetch ideas: [Database error message]"
}
```

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Successfully retrieved ideas |
| `401` | Unauthorized - User not authenticated |
| `400` | Bad request - Database error |
| `405` | Method not allowed (only GET is supported) |
| `500` | Internal server error |

---

## Error Cases

### Missing Authentication (401)
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```
**Cause:** User is not logged in
**Solution:** Call sign-in endpoint first

### Database Access Error (400)
```json
{
  "success": false,
  "error": "Failed to fetch ideas: [error details]"
}
```
**Cause:** Database query failed
**Solution:** Check Supabase connection and RLS policies

### Session Error (400)
```json
{
  "success": false,
  "error": "Failed to get session: [error details]"
}
```
**Cause:** Session retrieval failed
**Solution:** Check Supabase auth configuration

---

## Usage Examples

### Using Fetch API
```typescript
const response = await fetch('/api/getIdeas');
const result = await response.json();

if (result.success) {
  console.log(`Retrieved ${result.count} ideas`);
  result.data.forEach(idea => {
    console.log(`- ${idea.idea_text} (${idea.industry})`);
  });
} else {
  console.error('Error:', result.error);
}
```

### Using React Hook
```typescript
import { useGetIdeas } from '@/hooks/useGetIdeas';

function MyComponent() {
  const { isLoading, error, ideas, count, refetch } = useGetIdeas();

  return (
    <div>
      <h2>My Ideas ({count})</h2>
      
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {ideas && ideas.length > 0 ? (
        <ul>
          {ideas.map(idea => (
            <li key={idea.id}>
              <strong>{idea.idea_text}</strong>
              <span> - {idea.industry}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ideas yet</p>
      )}

      <button onClick={refetch} disabled={isLoading}>
        Refresh
      </button>
    </div>
  );
}
```

### Using cURL
```bash
curl -X GET http://localhost:3000/api/getIdeas \
  -H "Content-Type: application/json"
```

---

## Data Query Details

### Database Table: `startup_ideas`

**Columns Retrieved:**
- `id` (UUID) - Unique identifier
- `user_id` (UUID) - Owner of the idea
- `idea_text` (TEXT) - Idea description
- `industry` (VARCHAR) - Industry category
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Query Filters:**
- `user_id = current_user.id` - Only show ideas belonging to authenticated user

**Sort Order:**
- `created_at DESC` - Newest ideas first

### Example SQL Query Generated
```sql
SELECT id, user_id, idea_text, industry, created_at, updated_at
FROM startup_ideas
WHERE user_id = '13664e05-7f8d-468b-8085-7016ac9acb82'
ORDER BY created_at DESC;
```

---

## Authentication

The endpoint requires an authenticated Supabase session:

1. User must be logged in (established session)
2. Session is retrieved from Supabase auth context
3. User ID is extracted from session
4. User ID is used to filter ideas (enforced by query)
5. RLS policies enforce user data isolation

---

## Performance Considerations

- **Typical Response Time:** 50-200ms
- **Pagination:** Not implemented (client-side filtering recommended for large datasets)
- **Caching:** No built-in cache (implement client-side caching if needed)
- **Database Index:** `idx_idea_startup_ideas_user_id` recommended

### Recommended Index
```sql
CREATE INDEX IF NOT EXISTS idx_startup_ideas_user_id 
ON startup_ideas(user_id, created_at DESC);
```

---

## Rate Limiting

No built-in rate limiting. Apply at API Gateway level or middleware:

```typescript
// Example middleware (not included)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

app.get('/api/getIdeas', limiter, getIdeasHandler);
```

---

## Testing

Run the test file:
```bash
npx tsx src/test/testGetIdeasAPI.ts
```

Expected output:
```
================================================================================
Testing /api/getIdeas Endpoint
================================================================================

📋 Test 1: Call without authentication...
✅ Correctly returned 401 Unauthorized error
```

---

## Response Object Structure

```typescript
interface GetIdeasResponse {
  success: boolean;      // Whether the request succeeded
  data?: Idea[];         // Array of idea objects (only if success=true)
  count?: number;        // Number of ideas retrieved
  error?: string;        // Error message (only if success=false)
}

interface Idea {
  id: string;            // UUID
  user_id: string;       // UUID of owner
  idea_text: string;     // Idea description
  industry: string;      // Industry category
  created_at: string;    // ISO 8601 timestamp
  updated_at: string;    // ISO 8601 timestamp
}
```

---

## Related Files

- **Endpoint:** `src/api/getIdeas.ts`
- **Hook:** `src/hooks/useGetIdeas.ts`
- **Test:** `src/test/testGetIdeasAPI.ts`
- **Idea Service:** `src/services/ideaService.ts`

---

## Comparison with Similar Endpoints

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/analyzeIdea` | POST | Create & analyze idea | Single idea + analysis |
| `/api/getIdeas` | GET | Retrieve all ideas | Array of ideas |
| `ideaService.getUserIdeas()` | Function | Database query | Ideas array |

---

## Related Documentation

- [Idea Service Documentation](../../services/ideaService.ts)
- [Authentication Guide](../SETUP.md)
- [Database Schema](../setup-idea-analysis-table.sql)

---

## Workflow

```
1. User is authenticated (has session)
   ↓
2. GET /api/getIdeas called
   ↓
3. API retrieves session
   ↓
4. Extract user ID from session
   ↓
5. Query startup_ideas table
   WHERE user_id = [user_id]
   ORDER BY created_at DESC
   ↓
6. Return array of ideas
   ↓
7. Frontend displays ideas list
```

---

## Future Enhancements

- [ ] Add pagination support (limit, offset)
- [ ] Add filtering by industry
- [ ] Add search by idea_text
- [ ] Add sorting options (by date, alphabetical)
- [ ] Add caching for frequent requests
- [ ] Add idea status field (draft, submitted, analyzed)
- [ ] Include related analysis data in response
- [ ] Add batch operations (delete multiple)
