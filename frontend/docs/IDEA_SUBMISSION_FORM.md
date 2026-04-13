# Idea Submission Form Component

## Overview
The `IdeaSubmissionForm` component provides a complete user interface for submitting startup ideas and receiving AI-powered analysis. It's integrated into the main dashboard and handles the entire workflow from form submission to results display.

## Features

### 1. **Form Inputs**
- **Textarea (ideaText)**: Users describe their startup idea in detail
  - Placeholder guides users to include problem statement and target audience
  - Character counter (up to 500 characters)
  - Disabled during API calls
  
- **Industry Dropdown**: Users select from 19 predefined categories
  - EdTech, FinTech, HealthTech, HR Tech, AI/ML
  - E-commerce, SaaS, Sustainability, Travel & Tourism, Real Estate
  - Media & Entertainment, Food & Beverage, Supply Chain, Manufacturing
  - IoT, Cybersecurity, Blockchain, Gaming, Other
  - Disabled during API calls

- **Analyze Button**: Submits the form
  - Shows loading state with spinner while analyzing
  - Disabled when form fields are empty or during submission
  - Primary CTA with icon

- **Clear Button**: Resets form and clears results
  - Secondary action
  - Disabled during API calls

### 2. **AI Analysis Display**

#### Score Cards
Three individual score displays with visual progress bars:
- **Market Score**: Market potential and opportunity size (0-100)
- **Competition Score**: Competitive landscape analysis (0-100)
- **Feasibility Score**: Technical and operational feasibility (0-100)

Each score includes:
- Color-coded progress bar (Red: <50, Yellow: 50-70, Green: >70)
- Animated fill animation when results load
- Current score display (X/100)

#### Overall Viability Score
- Calculated as average of three scores
- Displayed in a badge format
- Quick summary of overall idea viability

#### Detailed Analysis
- Full text explanation from AI model
- Market insights, competitive advantages, implementation notes
- Formatted with line breaks for readability

#### Submitted Idea Details
- Idea UUID for reference
- Industry category
- Submission timestamp
- Displayed in a secondary card for record-keeping

### 3. **Error Handling**
- Displays error alerts with clear messaging
- Shows validation messages if fields are missing
- Handles API failures gracefully
- Maintains form state on error

### 4. **Loading States**
- Button shows spinner during analysis
- Textarea/dropdown disabled during processing
- Clear visual feedback that work is in progress

### 5. **Animations**
- Form appears with fade-in and slide-up animation
- Results appear with smooth fade-in animation
- Progress bars animate fill on display
- All animations use Framer Motion

## Usage

### Import
```typescript
import { IdeaSubmissionForm } from '@/components/dashboard/IdeaSubmissionForm';
```

### Placement in Page
```typescript
<div className="mb-8">
  <IdeaSubmissionForm />
</div>
```

### How It Works

**Step 1: User Input**
```
User enters idea description → Selects industry → Clicks "Analyze Idea"
```

**Step 2: API Call**
```
Component calls useAnalyzeIdea hook
→ Hook sends POST to /api/analyzeIdea
→ API authenticates user with Supabase
→ API calls createAndAnalyzeIdea pipeline
→ Pipeline creates idea record and gets AI analysis
```

**Step 3: Results Display**
```
Analysis returned with:
- Idea object (id, industry, text, timestamps)
- Analysis object (scores, analysis_text)

Component displays all results in organized cards with:
- Success indicator
- Score cards with progress bars
- Overall viability badge
- Detailed analysis text
- Idea metadata
- "Submit Another Idea" button
```

## Component Dependencies

### React Hooks
- `useState`: Form state management
- `useAnalyzeIdea` (custom): API integration hook

### UI Components
- `Button`: Action buttons
- `Card`: Result cards
- `Badge`: Score display badges
- `Alert`: Error messages

### Libraries
- `framer-motion`: Animations
- `lucide-react`: Icons (Zap, Loader2, AlertCircle, CheckCircle2)

## Props
The component accepts no props - it's a self-contained, standalone component.

## State Management

### Local State
```typescript
const [ideaText, setIdeaText] = useState(''); // Current textarea value
const [selectedIndustry, setSelectedIndustry] = useState(''); // Selected industry
```

### Hook State (useAnalyzeIdea)
```typescript
const { 
  isLoading,    // boolean - API call in progress
  error,        // string | null - Error message
  data,         // { idea, analysis } | null - Results
  analyzeIdea,  // function - Call API
  reset         // function - Clear state
} = useAnalyzeIdea();
```

## Score Display Logic

### Color Coding
```typescript
const percentage = (score / 100) * 100;
let color = 'bg-red-500';        // Default: poor
if (percentage >= 70) 
  color = 'bg-green-500';        // Good (70-100)
else if (percentage >= 50) 
  color = 'bg-yellow-500';       // Fair (50-70)
```

### Overall Viability
```typescript
Math.round(
  (market_score + competition_score + feasibility_score) / 3
)
```

## Error Scenarios

### Missing Authentication
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```
→ Component displays alert with error message

### Missing Fields
```json
{
  "success": false,
  "error": "Missing required fields: ideaText or industry"
}
```
→ Button remains disabled when fields are empty

### Network/API Error
```json
{
  "success": false,
  "error": "[Error message from server]"
}
```
→ Alert displays with error details

## Styling

### Tailwind Classes Used
- Layout: `space-y-*`, `grid`, `flex`, `gap-*`
- Colors: `bg-primary`, `text-foreground`, `border-input`
- States: `disabled:opacity-50`, `disabled:cursor-not-allowed`
- Effects: `backdrop-blur-sm`, `focus:ring-2`
- Responsive: `grid-cols-1 md:grid-cols-3`, `lg:col-span-2`

### Animation Classes
- `animate-spin`: Loader icon
- Framer Motion: Component entrance, progress bar fill

## Accessibility

- Form labels properly associated with inputs
- Disabled states prevent interaction
- Error messages use Alert component
- Color-coded scores have numeric fallback (e.g., "80/100")
- Clear button labels and descriptions
- Proper semantic HTML structure

## Performance Considerations

1. **Form State**: Local state only, doesn't trigger re-renders of parent
2. **API Calls**: Debounced by button click only (no form-change triggers)
3. **Animations**: Use Framer Motion (GPU-optimized)
4. **Progress Bars**: CSS transforms for smooth animation

## Integration with Dashboard

The component is integrated into `src/pages/Index.tsx`:
- Placed after stat cards
- Before chart section
- Takes full width on all screen sizes
- Mobile-responsive layout
- Animated entrance with page load

## Related Files

- **Hook:** `src/hooks/useAnalyzeIdea.ts`
- **API:** `src/api/analyzeIdea.ts`
- **Pipeline:** `src/services/ideaPipelineService.ts`
- **Dashboard:** `src/pages/Index.tsx`
- **UI Components:** `src/components/ui/`

## Future Enhancements

- [ ] Save analysis history
- [ ] Compare multiple ideas side-by-side
- [ ] Export results as PDF
- [ ] Share results with team members
- [ ] Add custom score weights
- [ ] Integration with idea tracking system
- [ ] Email results to user
- [ ] Idea refinement suggestions based on scores
