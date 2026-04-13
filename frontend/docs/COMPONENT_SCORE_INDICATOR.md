# Score Indicator Component

## Overview

The `ScoreIndicator` component is a modern, visually appealing circular progress indicator that displays AI analysis scores. It converts 0-100 scale scores to 0-10 display values and presents them with animated circular progress rings.

## Features

### Circular Progress Indicator
- **Animated SVG circles** with smooth transitions
- **Color-coded** by metric type (blue, purple, green, amber, red)
- **Two-layer design**: Background circle + animated progress ring
- **Percentage display** on the circle

### Display Information
- **Score out of 10**: Converted from 0-100 API scale
- **Icon**: Lucide React icons for visual identification
- **Label**: Clear, descriptive metric names
- **Percentage**: Shows raw 0-100 percentage below the circle

### Design Elements
- **Hover effect**: Scale up slightly on hover (1.05x)
- **Color-coded backgrounds**: Subtle background color matching metric
- **Responsive**: Works on all screen sizes
- **Modern styling**: Clean, minimal design with Tailwind CSS

## Installation

```bash
# Component is located at:
src/components/dashboard/ScoreIndicator.tsx

# Import in your component:
import { ScoreIndicator } from '@/components/dashboard/ScoreIndicator';
```

## Basic Usage

```typescript
import { ScoreIndicator } from '@/components/dashboard/ScoreIndicator';
import { TrendingUp } from 'lucide-react';

export function MyAnalysis() {
  const marketScore = 85; // 0-100 scale

  return (
    <ScoreIndicator
      label="Market Potential"
      value={marketScore}
      icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
      color="blue"
    />
  );
}
```

## Props API

```typescript
interface ScoreIndicatorProps {
  label: string;        // Metric label (e.g., "Market Potential")
  value: number;        // Score 0-100 (from API)
  icon: ReactNode;      // Lucide React icon component
  color: 'blue' | 'purple' | 'green' | 'amber' | 'red';
}
```

### Props Details

#### `label: string`
- Display name for the metric
- Shown below the circular indicator
- Examples: "Market Potential", "Competition Level", "Feasibility"

#### `value: number`
- Score from 0 to 100 (from API)
- Automatically converted to 0-10 display scale
- Controls the progress ring animation
- Example: `85` displays as `8.5/10`

#### `icon: ReactNode`
- Lucide React icon to display
- Color should match the `color` prop for consistency
- Positioned above the label

#### `color: 'blue' | 'purple' | 'green' | 'amber' | 'red'`
- Determines circle color and background color
- Color mapping:
  - **blue**: Market metrics (#3b82f6)
  - **purple**: Competition metrics (#a855f7)
  - **green**: Feasibility metrics (#22c55e)
  - **amber**: Warning metrics (#f59e0b)
  - **red**: Critical metrics (#ef4444)

## Score Scale Conversion

The component automatically converts API scores (0-100) to display scale (0-10):

```typescript
// Example conversions:
50  → 5.0/10
85  → 8.5/10
100 → 10.0/10
0   → 0.0/10
42  → 4.2/10
```

## Visual Design

### Circular Progress Ring
- **Radius**: 45 units (SVG viewBox 120x120)
- **Stroke width**: 8 units
- **Line cap**: Rounded for smooth appearance
- **Animation**: 0.6s ease transition

### Color Scheme

| Color | Circle | Background | Use Case |
|-------|--------|------------|----------|
| Blue | #3b82f6 | #eff6ff | Market Potential |
| Purple | #a855f7 | #faf5ff | Competition Level |
| Green | #22c55e | #f0fdf4 | Feasibility |
| Amber | #f59e0b | #fffbeb | Warning Scores |
| Red | #ef4444 | #fef2f2 | Critical Scores |

### Sizing
- **Indicator size**: 128px × 128px (w-32 h-32)
- **Icon size**: 20px × 20px (w-5 h-5)
- **Container padding**: 1.5rem (p-6)
- **Border radius**: 0.75rem (rounded-xl)

## Integration Example

```typescript
// In Analysis Detail Modal
<div className="grid grid-cols-3 gap-4">
  <ScoreIndicator
    label="Market Potential"
    value={analysis.market_score}
    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
    color="blue"
  />
  <ScoreIndicator
    label="Competition Level"
    value={analysis.competition_score}
    icon={<Users className="w-5 h-5 text-purple-600" />}
    color="purple"
  />
  <ScoreIndicator
    label="Feasibility"
    value={analysis.feasibility_score}
    icon={<Zap className="w-5 h-5 text-green-600" />}
    color="green"
  />
</div>
```

## Responsive Behavior

### Desktop (> 768px)
- 3 columns: `grid-cols-3`
- Full indicator display
- Hover scaling enabled

### Tablet (481px - 768px)
- Can adapt to 2-3 columns depending on layout
- All indicators visible

### Mobile (≤ 480px)
- Stack vertically if needed
- Indicators remain readable
- Hover effects work with touch

## Accessibility

- **Semantic HTML**: Uses standard SVG elements
- **Color + Text**: Doesn't rely on color alone for information
- **Labels**: Clear, descriptive labels below each indicator
- **Numbers**: Easily readable score values
- **Icon + Label**: Visual and text identification

## Performance

- **Lightweight**: ~3KB minified
- **No animations library**: Uses CSS transitions only
- **SVG based**: Scalable, crisp on all displays
- **Zero dependencies**: Only uses React and Tailwind

## Browser Support

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (includes iOS Safari)
- Edge: ✅ Full support

## Styling Variants

### Custom Styling

You can extend the component with additional props:

```typescript
// Future enhancement: custom sizes
<ScoreIndicator
  label="Market Potential"
  value={85}
  icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
  color="blue"
  size="large" // Future prop
/>
```

## Common Use Cases

### 1. Analysis Dashboard
```typescript
<div className="grid grid-cols-3 gap-4">
  {metrics.map(metric => (
    <ScoreIndicator
      key={metric.id}
      label={metric.label}
      value={metric.score}
      icon={metric.icon}
      color={metric.color}
    />
  ))}
</div>
```

### 2. Single Metric Display
```typescript
<ScoreIndicator
  label="Market Viability"
  value={marketAnalysis.score}
  icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
  color="blue"
/>
```

### 3. Comparison View
```typescript
<div className="grid grid-cols-2 gap-8">
  <div>
    <h3>Idea A</h3>
    <ScoreIndicator
      label="Market Potential"
      value={ideaA.marketScore}
      icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
      color="blue"
    />
  </div>
  <div>
    <h3>Idea B</h3>
    <ScoreIndicator
      label="Market Potential"
      value={ideaB.marketScore}
      icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
      color="blue"
    />
  </div>
</div>
```

## Troubleshooting

### Icon Not Showing
- Ensure you're importing from `lucide-react`
- Check className includes color: `text-blue-600`

### Circle Not Animating
- Verify SVG viewBox is correct: "0 0 120 120"
- Check stroke-dashoffset calculation
- Ensure CSS transitions aren't disabled

### Color Not Matching
- Verify `color` prop matches the icon color
- Check color mapping for typos

### Score Display Wrong
- Confirm API returns 0-100 scale
- Verify `value` prop is a number, not string
- Check conversion: `(value / 100) * 10`

## Future Enhancements

1. **Size variants**: small, medium, large
2. **Animation options**: pulse, bounce, etc.
3. **Clickable indicators**: Open detailed breakdown
4. **Tooltip on hover**: Show detailed metrics
5. **Comparative mode**: Highlight differences
6. **Export as image**: Save indicator as PNG/SVG
7. **Dark mode variants**: Additional color schemes
8. **Animated entrance**: Staggered load animations

## File Location

```
src/components/dashboard/ScoreIndicator.tsx
```

## Dependencies

- React (hooks: ReactNode)
- Tailwind CSS (styling)
- Lucide React (icons - for usage)

## Related Components

- **IdeasList**: Uses ScoreIndicator in analysis modal
- **Analysis Detail View**: Main integration point
- **Dashboard**: Parent component

## Related Documentation

- [ANALYSIS_DETAIL_VIEW.md](ANALYSIS_DETAIL_VIEW.md) - Feature overview
- [API_GET_ANALYSIS.md](API_GET_ANALYSIS.md) - API endpoint docs
- [HOOK_USE_GET_ANALYSIS.md](HOOK_USE_GET_ANALYSIS.md) - React hook docs

## Summary

The `ScoreIndicator` component provides a modern, professional way to visualize analysis metrics. With its circular progress design, color coding, and smooth animations, it makes score data both visually appealing and easy to understand at a glance.

The 0-10 scale display makes it more intuitive for users familiar with star ratings or out-of-10 scoring systems, while the component internally handles the conversion from the API's 0-100 scale.
