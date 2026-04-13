# IdeaSubmissionForm Component

A React component for submitting startup ideas with validation, error handling, and success messaging.

## Features

- ✅ Textarea input for idea description (20-5000 characters)
- ✅ Dropdown select for industry category (15+ industries)
- ✅ Character counter showing current/max characters
- ✅ Submit button with loading state
- ✅ Error message display
- ✅ Success message display (auto-dismisses after 5 seconds)
- ✅ Form validation before submission
- ✅ Disabled state while loading
- ✅ Fully responsive design
- ✅ Modern gradient UI with animations

## Props

Currently, this component accepts no props. It manages all state internally using React hooks.

```typescript
<IdeaSubmissionForm />
```

## Installation

1. Make sure you have the component files:
   - `src/components/IdeaSubmissionForm.tsx`
   - `src/components/IdeaSubmissionForm.css`

2. Import the hook it depends on:
   - `src/hooks/useCreateIdea.ts`

3. Ensure your API endpoint is available:
   - `POST /api/createIdea`

## Usage

### Basic Usage in a Component

```typescript
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import '@/components/IdeaSubmissionForm.css';

export function MyPage() {
  return (
    <div>
      <IdeaSubmissionForm />
    </div>
  );
}
```

### In App Router

```typescript
// pages/submit-idea.tsx
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import '@/components/IdeaSubmissionForm.css';

export default function SubmitIdeaPage() {
  return <IdeaSubmissionForm />;
}
```

### With Container Layout

```typescript
export function Dashboard() {
  return (
    <div className="dashboard-layout">
      <header>
        <h1>Submit Your Startup Idea</h1>
      </header>
      
      <main>
        <IdeaSubmissionForm />
      </main>
      
      <footer>
        <p>© 2024 AI Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
```

## Component Structure

```
IdeaSubmissionForm
├── Header (h2, description)
├── Form
│   ├── Idea Text Textarea
│   │   └── Character Counter
│   ├── Industry Select Dropdown
│   ├── Error Message (conditional)
│   ├── Success Message (conditional)
│   └── Submit Button
└── Form Note/Tip Section
```

## Form Fields

### 1. Idea Text (Textarea)

- **Type:** Textarea
- **Placeholder:** "Describe your startup idea in detail... (minimum 20 characters)"
- **Min length:** 20 characters
- **Max length:** 5000 characters
- **Required:** Yes
- **Validation:** Non-empty, minimum 20 chars

### 2. Industry (Select)

Available industries:
- Technology
- Healthcare
- Finance
- E-commerce
- Education
- Supply Chain
- Real Estate
- Entertainment
- Energy
- Manufacturing
- Agriculture
- Transportation
- Hospitality
- Other

- **Type:** Dropdown select
- **Required:** Yes
- **Default:** "Select an industry..."

### 3. Submit Button

- **Label:** "Analyze Idea"
- **Type:** Submit
- **States:**
  - Normal: Ready to submit (enabled)
  - Loading: "Analyzing..." with spinner (disabled)
  - Disabled: When form is invalid

## States

### Loading State

While the API request is pending:
- Button shows spinner animation
- Button text changes to "Analyzing..."
- All inputs are disabled
- Button is disabled

### Success State

After successful creation:
- Success message appears: "✅ Idea submitted successfully! Your idea is being analyzed."
- Form fields are cleared
- Message auto-dismisses after 5 seconds

### Error State

If an error occurs:
- Error message displays with red background
- Message persists until next submission attempt
- User can correct and resubmit

## Styling

### CSS Classes

- `.idea-submission-form-container` - Main wrapper
- `.idea-submission-form` - Form container
- `.form-group` - Individual form field group
- `.textarea-input` - Textarea styling
- `.select-input` - Select dropdown styling
- `.submit-button` - Submit button styling
- `.message` - Message box base styling
- `.error-message` - Error message styling
- `.success-message` - Success message styling
- `.character-count` - Character counter styling
- `.form-note` - Tip/note section styling

### Customization

To customize colors, modify the CSS variables or override classes:

```css
/* Override background gradient */
.idea-submission-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Override button colors */
.submit-button {
  background-color: rgba(255, 255, 255, 0.2);
}

.submit-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}
```

## API Integration

The component uses the `useCreateIdea` hook which calls:

**Endpoint:** `POST /api/createIdea`

**Request body:**
```json
{
  "ideaText": "string",
  "industry": "string"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Responsive Design

The component is fully responsive:

- **Desktop (>768px):** Full width form with optimal spacing
- **Tablet (480px-768px):** Adjusted padding and font sizes
- **Mobile (<480px):** Compact layout with reduced padding

## Accessibility

- ✅ Proper form labels associated with inputs
- ✅ Required field indicators (*)
- ✅ Error messages are descriptive
- ✅ Loading state is clear (button text + visual indicator)
- ✅ All interactive elements are keyboard accessible

## Dependencies

- **React 18+** - React library
- **useCreateIdea hook** - Custom hook for API calls
- **CSS** - Styling

No additional external UI libraries required!

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Example Integration

```typescript
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IdeaSubmissionPage from '@/pages/IdeaSubmission';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submit-idea" element={<IdeaSubmissionPage />} />
      </Routes>
    </Router>
  );
}
```

## Troubleshooting

### Form not submitting?
- Check that API endpoint `/api/createIdea` is available
- Verify user is authenticated (check Supabase session)
- Check browser console for error messages

### Styles not applying?
- Ensure CSS file is imported: `import '@/components/IdeaSubmissionForm.css'`
- Check CSS file path is correct
- Verify no conflicting global styles

### Messages not showing?
- Check browser console for API errors
- Verify API response format is correct
- Check that error/success states are being set

## Performance

- Component uses React.memo internally to prevent unnecessary re-renders
- Debounced character count updates
- Optimized form validation
- Lazy loading of industries list

## Security

- All user input is validated
- API calls include CSRF protection via Supabase
- User authentication required via Supabase
- XSS protection through React's built-in escape

## Future Enhancements

- [ ] Auto-save draft functionality
- [ ] File upload for supporting documents
- [ ] Idea templates
- [ ] Real-time collaboration
- [ ] Export functionality

---

**Need help?** See the demo page at `src/pages/IdeaSubmission.tsx`
