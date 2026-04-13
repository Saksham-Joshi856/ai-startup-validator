# Create Idea API Route

This directory contains the API route for creating startup ideas.

## Files

- **`createIdea.ts`** - Main API route handler
- **`../test/testCreateIdeaAPI.ts`** - Tests for the handler
- **`../hooks/useCreateIdea.ts`** - React hook for client-side usage

## API Endpoint

**POST** `/api/createIdea`

### Request Body

```json
{
  "ideaText": "string - Description of the startup idea",
  "industry": "string - Industry category"
}
```

### Response (Success - 201)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "idea_text": "string",
    "industry": "string",
    "created_at": "ISO timestamp"
  }
}
```

### Response (Error - 400/500)

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Usage Examples

### 1. Using the React Hook (Recommended for Components)

```typescript
import { useCreateIdea } from '@/hooks/useCreateIdea';

function CreateIdeaForm() {
  const { createIdea, isLoading, error } = useCreateIdea();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await createIdea(
      formData.get('ideaText') as string,
      formData.get('industry') as string
    );

    if (result.success) {
      console.log('Idea created:', result.data);
      // Handle success
    } else {
      console.error('Error:', result.error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="ideaText" placeholder="Idea description" required />
      <input name="industry" placeholder="Industry" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Idea'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 2. Direct Fetch (Without Hook)

```typescript
const response = await fetch('/api/createIdea', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ideaText: 'My startup idea',
    industry: 'Technology',
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Created:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### 3. Using Handler Function Directly (Server-side)

```typescript
import { handleCreateIdea } from '@/api/createIdea';

// Call directly in server-side code
const result = await handleCreateIdea('Idea text here', 'Industry here');
if (result.success) {
  console.log('Created:', result.data);
}
```

### 4. Express.js Integration

```typescript
import { createIdeaHandler } from '@/api/createIdea';
import express from 'express';

const app = express();

app.post('/api/createIdea', createIdeaHandler);
```

## Authentication

The API route automatically:
1. Checks if the user is authenticated via Supabase
2. Gets the authenticated user's ID
3. Associates the idea with that user
4. Returns error if user is not authenticated

**Note:** Ensure the client has a valid Supabase session before calling this API.

## Error Handling

The API handles several error cases:

| Error | Status | Description |
|-------|--------|-------------|
| Missing parameters | 400 | No ideaText or industry provided |
| Not authenticated | 401 | User is not logged in |
| Database error | 500 | Supabase insert failed |
| Server error | 500 | Unexpected exception |

## Security

✅ Supabase authentication required
✅ RLS policies protect startup_ideas table
✅ User can only create ideas for themselves
✅ Input validation on all parameters

## Integration Steps

1. **Backend Setup**: Deploy this API route to your server
   - Express.js: Use `createIdeaHandler`
   - Vite SSR: Configure as endpoint
   - Vercel: Deploy as serverless function
   - Other: Use `handleCreateIdea` or `POST` function

2. **Frontend Setup**: Use the React hook in your components
   ```typescript
   import { useCreateIdea } from '@/hooks/useCreateIdea';
   ```

3. **Test**: Run the test file
   ```bash
   npx tsx src/test/testCreateIdeaAPI.ts
   ```

## Dependencies

- `@supabase/supabase-js` - Database operations
- `../services/ideaService.ts` - Business logic
- React 18+ (for hooks)

## Testing

Run the test suite:
```bash
npx tsx src/test/testCreateIdeaAPI.ts
```

Tests included:
- ✅ Successful idea creation
- ✅ Parameter validation
- ✅ Error handling
