# useGetIdeas Hook Documentation

## Overview
The `useGetIdeas` hook provides an easy way to fetch and manage the user's startup ideas in React components. It handles authentication, loading states, error handling, and automatic refetching.

## Installation
```typescript
import { useGetIdeas } from '@/hooks/useGetIdeas';
```

## Basic Usage

### Auto-fetch on Mount (Default)
```typescript
function MyComponent() {
  const { isLoading, error, ideas, count } = useGetIdeas();

  if (isLoading) return <div>Loading ideas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Ideas ({count})</h2>
      <ul>
        {ideas?.map(idea => (
          <li key={idea.id}>{idea.idea_text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Manual Fetch (No Auto-fetch)
```typescript
function MyComponent() {
  const { isLoading, error, ideas, refetch } = useGetIdeas(false);

  return (
    <div>
      <button onClick={refetch} disabled={isLoading}>
        Load Ideas
      </button>
      {ideas && <IdeasList ideas={ideas} />}
    </div>
  );
}
```

## Hook API

### Parameters
```typescript
useGetIdeas(autoFetch?: boolean = true)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `autoFetch` | boolean | true | Whether to automatically fetch ideas on mount |

### Return Value
```typescript
interface UseGetIdeasResult {
  isLoading: boolean;           // Loading state
  error: string \| null;         // Error message or null
  ideas: Idea[] \| null;         // Array of ideas or null
  count: number;                // Number of ideas (0 if none)
  refetch: () => Promise<void>; // Function to manually refetch
  reset: () => void;            // Function to reset all state
}
```

### State Properties

#### `isLoading: boolean`
- `true` while fetching ideas or during initial load
- `false` when data is ready or error occurred
- Useful for showing loading spinners

```typescript
{isLoading && <Loader />}
{!isLoading && ideas && <IdeasList ideas={ideas} />}
```

#### `error: string | null`
- `null` if no error
- String containing error message if request failed
- Common errors:
  - "User not authenticated. Please sign in first." (401)
  - "Failed to fetch ideas: [details]" (400)
  - "Unknown error occurred" (500)

```typescript
{error && <Alert severity="error">{error}</Alert>}
```

#### `ideas: Idea[] | null`
- `null` while loading
- Empty array `[]` if user has no ideas
- Array of `Idea` objects if successful

```typescript
interface Idea {
  id: string;              // UUID
  user_id: string;         // UUID of owner
  idea_text: string;       // Idea description
  industry: string;        // Industry category
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

#### `count: number`
- Number of ideas retrieved
- Always matches `ideas?.length || 0`
- Useful for displaying summary ("5 ideas")

```typescript
<h2>Your Ideas ({count})</h2>
```

#### `refetch: () => Promise<void>`
- Manually trigger data refetch
- Resets error state before fetching
- Can be called from onClick handlers

```typescript
<button onClick={refetch} disabled={isLoading}>
  Refresh Ideas
</button>
```

#### `reset: () => void`
- Clear all state (loading, error, data, count)
- Useful for cleanup or logout scenarios

```typescript
function LogoutButton() {
  const { reset } = useGetIdeas();
  
  const handleLogout = () => {
    reset();
    // ... logout logic
  };
}
```

## Advanced Examples

### Ideas List with Refresh
```typescript
function IdeasList() {
  const { isLoading, error, ideas, count, refetch } = useGetIdeas();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>My Ideas ({count})</h2>
        <button 
          onClick={refetch} 
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading && ideas === null && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {ideas && ideas.length > 0 ? (
        <div className="grid gap-4">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No ideas yet</p>
      )}
    </div>
  );
}
```

### Filter Ideas by Industry
```typescript
function IdeasByIndustry({ selectedIndustry }) {
  const { ideas } = useGetIdeas();

  const filtered = ideas?.filter(
    idea => idea.industry === selectedIndustry
  ) || [];

  return <IdeasList ideas={filtered} />;
}
```

### Search Ideas
```typescript
function SearchIdeas() {
  const { ideas } = useGetIdeas();
  const [query, setQuery] = useState('');

  const filtered = ideas?.filter(idea =>
    idea.idea_text.toLowerCase().includes(query.toLowerCase()) ||
    idea.industry.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <div>
      <input
        type="text"
        placeholder="Search ideas..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <IdeasList ideas={filtered} />
    </div>
  );
}
```

### Conditional Rendering Based on Count
```typescript
function DashboardOverview() {
  const { ideas, count } = useGetIdeas();

  if (count === 0) {
    return (
      <Card>
        <p>No ideas yet. Create your first idea to get started!</p>
        <button>Create Idea</button>
      </Card>
    );
  }

  return (
    <Card>
      <h3>You have {count} idea{count !== 1 ? 's' : ''}</h3>
      <IdeasList ideas={ideas} />
    </Card>
  );
}
```

### Combined with Analysis Data
```typescript
function IdeasWithAnalysis() {
  const { ideas } = useGetIdeas();

  return (
    <div>
      {ideas?.map(idea => (
        <IdeaCard 
          key={idea.id} 
          idea={idea}
          showAnalysis={true}
        />
      ))}
    </div>
  );
}
```

## Common Patterns

### Loading with Skeleton
```typescript
import { Skeleton } from '@/components/ui/skeleton';

function IdeasListWithSkeleton() {
  const { isLoading, ideas } = useGetIdeas();

  return (
    <div className="space-y-2">
      {isLoading && ideas === null ? (
        <>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </>
      ) : (
        <IdeasList ideas={ideas} />
      )}
    </div>
  );
}
```

### Error Recovery
```typescript
function IdeasWithRetry() {
  const { error, ideas, refetch, isLoading } = useGetIdeas();

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded">
        <p className="text-red-700 mb-3">{error}</p>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return <IdeasList ideas={ideas} />;
}
```

### Polling/Auto-refresh
```typescript
import { useEffect } from 'react';

function IdeasWithAutoRefresh() {
  const { ideas, refetch } = useGetIdeas();

  useEffect(() => {
    // Refresh every 30 seconds
    const interval = setInterval(refetch, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  return <IdeasList ideas={ideas} />;
}
```

### Sync with Mutation
```typescript
function IdeasSync() {
  const { refetch } = useGetIdeas(false);
  
  const handleIdeaCreated = async (newIdea) => {
    // Idea was just created, refetch to see it
    await refetch();
  };

  return (
    <div>
      <IdeaSubmissionForm onSuccess={handleIdeaCreated} />
      <IdeasList />
    </div>
  );
}
```

## Performance Considerations

### Prevent Unnecessary Re-renders
```typescript
// Don't destructure everything if you don't use it
const { ideas, count } = useGetIdeas(); // Good
const { isLoading, error, ideas, count, refetch, reset } = useGetIdeas(); // Fine but more re-renders

// Memoize the list to prevent cascading re-renders
import { useMemo } from 'react';

function IdeasList({ ideas }) {
  const memoized = useMemo(() => ideas || [], [ideas]);
  return <div>{memoized.map(...)}</div>;
}
```

### Debounce Refetch
```typescript
import { useCallback, useRef } from 'react';

function IdeasWithDebounce() {
  const { refetch } = useGetIdeas();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedRefetch = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      refetch();
    }, 500);
  }, [refetch]);

  return <button onClick={debouncedRefetch}>Refresh</button>;
}
```

## Error Handling

### Status Code Mapping
```typescript
const { error } = useGetIdeas();

// 401 Unauthorized
if (error?.includes('authenticated')) {
  // Redirect to login
}

// 400 Bad Request
if (error?.includes('Failed to fetch')) {
  // Show error and retry option
}

// 500 Internal Server Error
if (error?.includes('Unknown error')) {
  // Show generic error message
}
```

## Testing

### Mock Hook in Tests
```typescript
import { vi } from 'vitest';
import { useGetIdeas } from '@/hooks/useGetIdeas';

vi.mock('@/hooks/useGetIdeas', () => ({
  useGetIdeas: vi.fn(() => ({
    isLoading: false,
    error: null,
    ideas: [
      {
        id: 'test-id',
        user_id: 'user-id',
        idea_text: 'Test idea',
        industry: 'EdTech',
        created_at: '2026-04-12T10:00:00Z',
        updated_at: '2026-04-12T10:00:00Z',
      }
    ],
    count: 1,
    refetch: vi.fn(),
    reset: vi.fn(),
  }))
}));
```

## Related Hooks

- `useAnalyzeIdea` - Analyze a single idea
- `useGetIdeas` - Retrieve all user ideas
- Custom: Create `useGetIdeaById` for single idea retrieval

## Related Files

- **API Endpoint:** `src/api/getIdeas.ts`
- **API Documentation:** `docs/API_GET_IDEAS.md`
- **Test File:** `src/test/testGetIdeasAPI.ts`
- **Service Layer:** `src/services/ideaService.ts`
