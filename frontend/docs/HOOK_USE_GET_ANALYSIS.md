# useGetAnalysis Hook Documentation

## Overview
The `useGetAnalysis` hook provides an easy way to fetch AI analysis data for a specific startup idea in React components. It automatically fetches when the `ideaId` changes and manages loading, error, and data states.

## Installation
```typescript
import { useGetAnalysis } from '@/hooks/useGetAnalysis';
```

## Basic Usage

### Auto-fetch When ideaId Changes (Default)
```typescript
function AnalysisDetail({ ideaId }) {
  const { isLoading, error, analysis } = useGetAnalysis(ideaId);

  if (isLoading) return <div>Loading analysis...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysis) return <div>No analysis</div>;

  return (
    <div>
      <h3>Market Score: {analysis.market_score}/100</h3>
      <h3>Competition Score: {analysis.competition_score}/100</h3>
      <h3>Feasibility Score: {analysis.feasibility_score}/100</h3>
      <p>{analysis.analysis_text}</p>
    </div>
  );
}
```

### With No ideaId Initially
```typescript
function MyComponent() {
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const { analysis, isLoading, refetch } = useGetAnalysis(selectedIdeaId);

  return (
    <div>
      <button onClick={() => setSelectedIdeaId('some-id')}>
        Load Analysis
      </button>
      {analysis && <AnalysisDisplay data={analysis} />}
    </div>
  );
}
```

## Hook API

### Parameters
```typescript
useGetAnalysis(ideaId: string | null)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `ideaId` | string \| null | UUID of the idea to fetch analysis for. Auto-fetches when changed. |

### Return Value
```typescript
interface UseGetAnalysisResult {
  isLoading: boolean;           // Loading state
  error: string \| null;         // Error message or null
  analysis: AnalysisData \| null; // Analysis data or null
  refetch: () => Promise<void>; // Function to manually refetch
  reset: () => void;            // Function to reset all state
}
```

### State Properties

#### `isLoading: boolean`
- `true` while fetching or during initial load
- `false` when data is ready or error occurred
- Useful for showing loading spinners

```typescript
{isLoading && <Loader />}
{!isLoading && analysis && <AnalysisCards analysis={analysis} />}
```

#### `error: string | null`
- `null` if no error
- String containing error message if request failed
- Common errors:
  - "No idea ID provided" - ideaId parameter is null
  - "No analysis found for idea [id]" (404)
  - "Missing required parameter: ideaId" (400)
  - "Unknown error occurred" (500)

```typescript
{error && <Alert severity="error">{error}</Alert>}
```

#### `analysis: AnalysisData | null`
- `null` while loading or if no ideaId
- Analysis object if successful
- Contains scores and detailed text

```typescript
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

#### `refetch: () => Promise<void>`
- Manually trigger data refetch
- Uses current ideaId value
- Can be called from onClick handlers

```typescript
<button onClick={refetch} disabled={isLoading}>
  Refresh Analysis
</button>
```

#### `reset: () => void`
- Clear all state (loading, error, data)
- Useful for cleanup or switching ideas

```typescript
const handleClearAnalysis = () => {
  reset();
};
```

## Advanced Examples

### Analysis Display with Scores
```typescript
function AnalysisView({ ideaId }) {
  const { isLoading, error, analysis } = useGetAnalysis(ideaId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorAlert message={error} />;
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <ScoreCard label="Market" score={analysis.market_score} />
      <ScoreCard label="Competition" score={analysis.competition_score} />
      <ScoreCard label="Feasibility" score={analysis.feasibility_score} />
      <AnalysisText text={analysis.analysis_text} />
    </div>
  );
}
```

### Analysis Drawer on Idea Click
```typescript
function IdeasList({ ideas }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const { analysis, isLoading } = useGetAnalysis(selectedIdeaId);

  return (
    <div className="grid gap-4">
      {ideas.map(idea => (
        <Card
          key={idea.id}
          onClick={() => setSelectedIdeaId(idea.id)}
          className="cursor-pointer hover:bg-accent"
        >
          {idea.idea_text}
        </Card>
      ))}

      {selectedIdeaId && (
        <Drawer isOpen={true}>
          {isLoading ? (
            <p>Loading analysis...</p>
          ) : analysis ? (
            <AnalysisDisplay analysis={analysis} />
          ) : null}
        </Drawer>
      )}
    </div>
  );
}
```

### Tab Navigation with Different Ideas
```typescript
function IdeaComparison() {
  const [activeIdeaId, setActiveIdeaId] = useState(null);
  const { analysis: activeAnalysis } = useGetAnalysis(activeIdeaId);

  return (
    <Tabs>
      <TabList>
        {ideas.map(idea => (
          <Tab
            key={idea.id}
            onClick={() => setActiveIdeaId(idea.id)}
            active={activeIdeaId === idea.id}
          >
            {idea.idea_text}
          </Tab>
        ))}
      </TabList>

      {activeAnalysis && (
        <TabPanel>
          <AnalysisDetail analysis={activeAnalysis} />
        </TabPanel>
      )}
    </Tabs>
  );
}
```

### Conditional Rendering Based on Scores
```typescript
function AnalysisInsights({ ideaId }) {
  const { analysis } = useGetAnalysis(ideaId);

  if (!analysis) return null;

  const isHighPotential = 
    analysis.market_score > 70 &&
    analysis.feasibility_score > 70;

  return (
    <div>
      {isHighPotential && (
        <Alert severity="success">
          🎯 High potential idea - market and feasibility scores are strong!
        </Alert>
      )}

      {analysis.competition_score > 80 && (
        <Alert severity="warning">
          ⚠️ High competition in this space - differentiation is key
        </Alert>
      )}
    </div>
  );
}
```

## Common Patterns

### Loading with Skeleton
```typescript
import { Skeleton } from '@/components/ui/skeleton';

function AnalysisWithSkeleton({ ideaId }) {
  const { isLoading, analysis } = useGetAnalysis(ideaId);

  return (
    <div className="space-y-4">
      {isLoading && !analysis ? (
        <>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </>
      ) : (
        analysis && <AnalysisDisplay analysis={analysis} />
      )}
    </div>
  );
}
```

### Error Recovery with Retry
```typescript
function AnalysisWithRetry({ ideaId }) {
  const { error, analysis, isLoading, refetch } = useGetAnalysis(ideaId);

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

  return analysis ? <AnalysisDisplay analysis={analysis} /> : null;
}
```

### Switch Between Ideas
```typescript
function IdeaAnalyzer({ ideas }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentIdeaId = ideas[currentIdx]?.id || null;
  const { analysis, refetch } = useGetAnalysis(currentIdeaId);

  const goNext = () => {
    if (currentIdx < ideas.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={goPrev} disabled={currentIdx === 0}>
          Previous
        </button>
        <span>{currentIdx + 1} / {ideas.length}</span>
        <button onClick={goNext} disabled={currentIdx === ideas.length - 1}>
          Next
        </button>
      </div>
      {analysis && <AnalysisDisplay analysis={analysis} />}
    </div>
  );
}
```

## Performance Considerations

### Avoid Refetching Same ideaId
```typescript
// ✅ Good: useEffect handles dependency properly
const { analysis, isLoading } = useGetAnalysis(ideaId);

// ❌ Bad: Don't call refetch outside of handler
const handleSomething = () => {
  const { refetch } = useGetAnalysis(ideaId); // New instance!
  refetch();
};
```

### Memoize Analysis Calculations
```typescript
import { useMemo } from 'react';

function AnalysisStats({ ideaId }) {
  const { analysis } = useGetAnalysis(ideaId);

  const stats = useMemo(() => {
    if (!analysis) return null;
    return {
      average: Math.round(
        (analysis.market_score + 
         analysis.competition_score + 
         analysis.feasibility_score) / 3
      ),
      maxScore: Math.max(
        analysis.market_score,
        analysis.competition_score,
        analysis.feasibility_score
      ),
    };
  }, [analysis]);

  return stats ? <StatsDisplay stats={stats} /> : null;
}
```

## Testing

### Mock Hook in Tests
```typescript
import { vi } from 'vitest';
import { useGetAnalysis } from '@/hooks/useGetAnalysis';

vi.mock('@/hooks/useGetAnalysis', () => ({
  useGetAnalysis: vi.fn(() => ({
    isLoading: false,
    error: null,
    analysis: {
      id: 'test-id',
      idea_id: 'idea-id',
      market_score: 85,
      competition_score: 72,
      feasibility_score: 88,
      analysis_text: 'Test analysis',
      created_at: '2026-04-12T10:00:00Z',
      updated_at: '2026-04-12T10:00:00Z',
    },
    refetch: vi.fn(),
    reset: vi.fn(),
  }))
}));
```

## Related Hooks

- `useGetIdeas` - Retrieve all user ideas
- `useAnalyzeIdea` - Analyze a new idea
- `useGetAnalysis` - Get analysis for specific idea

## Related Files

- **API Endpoint:** `src/api/getAnalysis.ts`
- **API Documentation:** `docs/API_GET_ANALYSIS.md`
- **Test File:** `src/test/testGetAnalysisAPI.ts`
- **Analysis Service:** `src/services/analysisService.ts`

## Type Definitions

```typescript
interface AnalysisData {
  id: string;                    // UUID
  idea_id: string;               // UUID of associated idea
  market_score: number;          // 0-100
  competition_score: number;     // 0-100
  feasibility_score: number;     // 0-100
  analysis_text: string;         // Detailed analysis
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}

interface UseGetAnalysisResult {
  isLoading: boolean;
  error: string | null;
  analysis: AnalysisData | null;
  refetch: () => Promise<void>;
  reset: () => void;
}
```
