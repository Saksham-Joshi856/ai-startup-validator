# Developer Reference - Navigation, Charts & Dropdown

## Quick Navigation Reference

### Routes Available
```javascript
/           → Dashboard
/validate   → Validate Idea Page
/reports    → Reports Page
/advisor    → AI Advisor Page
/settings   → Settings Page
```

### Adding a New Navigation Item

**Sidebar + Bottom Nav** (same code pattern):
```jsx
const navItems = [
  // ... existing items
  { icon: IconName, label: "New Page", path: "/newpage" },
];
```

**Make sure to**:
1. Add route in `App.tsx` (or routing config)
2. Create corresponding page component
3. Use same path in both sidebar and bottom nav

---

## Chart Height Management

### Current System
All charts use CSS `clamp()` for responsive heights:

```jsx
<motion.div 
  className="w-full" 
  style={{ height: 'clamp(250px, 60vw, 400px)' }}
>
  <ResponsiveContainer width="100%" height="100%">
    <YourChart data={data} />
  </ResponsiveContainer>
</motion.div>
```

### Adjusting Heights
- **Minimum (mobile)**: First value - `250px`
- **Maximum (desktop)**: Third value - `400px`
- **Scaling factor**: Second value - `60vw` (60% of viewport width)

Example - Change to 300px-500px range:
```jsx
style={{ height: 'clamp(300px, 60vw, 500px)' }}
```

### Charts Affected
- IndustryTrendChart
- ScoreDistributionChart
- MarketOpportunityChart
- ScoreTrendChart

---

## Profile Dropdown Implementation

### How It Works
```tsx
// 1. Track dropdown visibility
const [showDropdown, setShowDropdown] = useState(false);

// 2. Reference for click-outside detection
const dropdownRef = useRef<HTMLDivElement>(null);

// 3. Close on outside click
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }
  
  if (showDropdown) {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [showDropdown]);
```

### Key Features
- **Click outside**: Closes automatically
- **Navigation**: Updates state and closes
- **Logout**: Signs out and closes
- **Animation**: Smooth entrance/exit with Framer Motion

### Customizing Dropdown

**Change width**:
```jsx
className="... w-64 ..."  // Change w-64 to desired width
```

**Change animation**:
```jsx
initial={{ opacity: 0, y: -12, scale: 0.92 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
// Adjust values to change animation style
```

**Add menu items**:
```jsx
<button
  onClick={() => handleNavigation("/newroute")}
  className="w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors duration-150"
>
  <IconComponent className="w-4 h-4" />
  <span>Menu Item</span>
</button>
```

---

## Navigation Sync Verification

### Check If Routes Match
Verify `DashboardSidebar.tsx` and `BottomNavigation.tsx` have identical paths:

```javascript
// Both should have exactly the same navItems
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Lightbulb, label: "Validate", path: "/validate" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Bot, label: "Advisor", path: "/advisor" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
```

### Active State Logic
Both use identical detection:
```jsx
const isActive = (path: string) => location.pathname === path;
```

---

## Common Tasks

### Task: Change Active State Color
**File**: Any navigation component

**Find**:
```jsx
className={`... ${active ? "text-primary" : "text-muted-foreground"} ...`}
```

**Change `primary` to another color** (e.g., `accent`):
```jsx
className={`... ${active ? "text-accent" : "text-muted-foreground"} ...`}
```

---

### Task: Make Charts Taller on Mobile
**File**: Chart component (e.g., `IndustryTrendChart.tsx`)

**Find**:
```jsx
style={{ height: 'clamp(250px, 60vw, 400px)' }}
```

**Change minimum from 250px to 300px**:
```jsx
style={{ height: 'clamp(300px, 60vw, 400px)' }}
```

---

### Task: Add Notification Count Badge
**File**: `TopNavbar.tsx`

**Current**:
```jsx
<span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
```

**Add count**:
```jsx
<span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
  {notificationCount}
</span>
```

---

### Task: Add More Menu Items to Dropdown
**File**: `TopNavbar.tsx`

**Add in menu section**:
```jsx
<button
  onClick={() => {
    // Handle action
    setShowDropdown(false);
  }}
  className="w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors duration-150"
>
  <IconComponent className="w-4 h-4" />
  <span>Menu Item</span>
</button>
```

---

## Troubleshooting

### Navigation not highlighting on mobile
**Check**: Both sidebar and bottom nav have identical route paths

### Charts overflowing on mobile
**Check**: Chart container has `overflow: hidden` parent
**Fix**: Wrap chart in responsive container with proper styling

### Dropdown not closing on outside click
**Check**: Ensure `dropdownRef` is attached to the container div
**Check**: Event listener cleanup is working

### Charts rendering with wrong height
**Check**: CSS clamp syntax is correct
**Check**: ResponsiveContainer has proper parent dimensions

---

## Performance Tips

### Navigation
- Use `useLocation()` (efficient)
- Avoid complex route matching logic
- Keep nav items array static (not in render)

### Charts
- Use `ResponsiveContainer` from Recharts
- CSS clamp() is performant (no JS calculation)
- Lazy load charts if needed

### Dropdown
- Clean up event listeners (already done in useEffect)
- Use ref for click-outside detection (efficient)
- AnimatePresence prevents unmounting animation lag

---

## Testing Commands

```bash
# Check navigation
npm test -- navigation.test.tsx

# Check chart responsive behavior
npm test -- chart.test.tsx

# E2E test dropdown
npx cypress open  # Then test /settings route
```

---

## Related Documentation

- `RESPONSIVE_DESIGN.md` - Full design system
- `REDESIGN_SUMMARY.md` - UI/UX redesign details
- `NAVIGATION_CHARTS_DROPDOWN_FIX.md` - Technical implementation

---

**Last Updated**: April 27, 2026  
**Maintainer**: Engineering Team
