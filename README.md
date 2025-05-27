# Grade Calculator - Reusable Tilda Component

This grade calculator can be easily reused across multiple Tilda pages by separating the code into external files.

## Setup Instructions

### Step 1: Host External Files

Upload these files to your hosting (or Tilda file manager):
- `grade-calculator.css` - All styling
- `grade-calculator.js` - All functionality

**Recommended paths:**
```
https://yourdomain.com/assets/grade-calculator.css
https://yourdomain.com/assets/grade-calculator.js
```

### Step 2: Implementation Methods

## Method A: T123 HTML Block (Recommended)

1. **Add a T123 block** to any page where you want the calculator
2. **Add external files** in the block header:

```html
<link rel="stylesheet" href="https://yourdomain.com/assets/grade-calculator.css">
<script src="https://yourdomain.com/assets/grade-calculator.js"></script>
```

3. **Copy the HTML template** from `grade-calculator-template.html` into the T123 content area

## Method B: Site-wide Implementation

1. **In Tilda Site Settings** → **Other settings** → **Add code to <head>**:
```html
<link rel="stylesheet" href="https://yourdomain.com/assets/grade-calculator.css">
```

2. **Add to footer before </body>**:
```html
<script src="https://yourdomain.com/assets/grade-calculator.js"></script>
```

3. **Use T120 HTML block** on any page and just paste the HTML template

## Method C: CDN/External Hosting

Use services like:
- **Dropbox/Google Drive** (get direct links)
- **GitHub Pages** (free hosting)
- **JSDelivr** or **unpkg** for package distribution

Example with GitHub:
```html
<link rel="stylesheet" href="https://your-username.github.io/your-repo/grade-calculator.css">
<script src="https://your-username.github.io/your-repo/grade-calculator.js"></script>
```

## Benefits of This Approach

✅ **Easy Updates**: Change logic once, updates everywhere  
✅ **Faster Loading**: Browser caches files across pages  
✅ **Cleaner Code**: No duplicate CSS/JS on every page  
✅ **Version Control**: Track changes easily  
✅ **Maintenance**: Single source of truth  

## Customization

### Change Academic Years
Edit the `academicConfig` object in `grade-calculator.js`:

```javascript
const academicConfig = {
  2025: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 },
  2026: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 }
};
```

### Modify Program Rules
Update `programRules` in `grade-calculator.js`:

```javascript
const programRules = {
  '4': year => ['IB', 'Waldorf'], // No Montessori for grade 4
  // ... other grades
};
```

### Style Changes
Modify variables in `grade-calculator.css`:

```css
.grade-calculator {
  --primary-color: #ffffff;
  --accent-color: #ea5f00;
  --border-radius: 100px;
}
```

## Integration with Forms

The calculator automatically integrates with any form containing `input[name="DOB"]`. When users click a link with `href="#popup:gradecalc"`, it will:

1. Auto-populate the calculator with the main form's DOB
2. Calculate grades immediately
3. Display results in the popup

## API Reference

The component exposes a global `GradeCalculator` object:

```javascript
// Manual initialization (if needed)
GradeCalculator.init();

// Force update grades
GradeCalculator.updateGrades();
```

## Troubleshooting

**Calculator not working?**
- Check browser console for errors
- Verify file paths are correct
- Ensure HTML IDs match (`gradecalc-dob`, `grade2024`, etc.)

**Styles not loading?**
- Check CSS file path
- Verify CORS headers if hosting externally
- Ensure CSS loads before HTML

**Updates not reflecting?**
- Clear browser cache
- Add version parameter: `grade-calculator.js?v=1.1` 