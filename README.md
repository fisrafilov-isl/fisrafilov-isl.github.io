# Tilda Components Library

A collection of reusable components for Tilda websites, hosted on GitHub Pages for easy integration.

## 📁 Project Structure

```
/
├── grade_calc/                 # Grade Calculator Component
│   ├── css/
│   │   └── grade-calculator.css
│   ├── js/
│   │   └── grade-calculator.js
│   ├── templates/
│   │   └── grade-calculator-template.html
│   ├── all-in-one-example.html
│   └── README.md
├── smooth_scrolling/           # Smooth Scrolling Component
│   ├── css/
│   │   └── smooth-scrolling.css
│   ├── js/
│   │   └── smooth-scrolling.js
│   ├── templates/
│   │   └── smooth-scrolling-template.html
│   ├── all-in-one-example.html
│   └── README.md
├── future_project/             # Future Component
│   ├── css/
│   ├── js/
│   └── templates/
└── README.md                   # This file
```

## 🚀 Live URLs

### Grade Calculator
- **CSS**: `https://your-username.github.io/your-repo-name/grade_calc/css/grade-calculator.css`
- **JavaScript**: `https://your-username.github.io/your-repo-name/grade_calc/js/grade-calculator.js`

### Smooth Scrolling  
- **CSS**: `https://your-username.github.io/your-repo-name/smooth_scrolling/css/smooth-scrolling.css`
- **JavaScript**: `https://your-username.github.io/your-repo-name/smooth_scrolling/js/smooth-scrolling.js`

## 📋 Components Overview

### 🧮 **Grade Calculator**
Interactive calculator that determines student grades and program eligibility based on birth date and academic year.

**Features:**
- Auto-population from main forms
- Real-time grade calculation
- Program availability by year
- Clickable program links
- Popup integration

### 🖱️ **Smooth Scrolling**
Intelligent smooth scrolling that adapts to input devices (mouse vs trackpad) with Tilda popup support.

**Features:**
- Adaptive scrolling behavior
- Mouse/trackpad detection
- Popup scroll management
- Anchor link enhancement
- Performance optimized

## 📋 How to Use in Tilda

### Method 1: T123 Block with External Files
```html
<!-- Grade Calculator -->
<link rel="stylesheet" href="https://your-username.github.io/your-repo-name/grade_calc/css/grade-calculator.css">
<script src="https://your-username.github.io/your-repo-name/grade_calc/js/grade-calculator.js"></script>

<!-- Smooth Scrolling (requires Lenis) -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.3/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.3/dist/lenis.min.js"></script>
<link rel="stylesheet" href="https://your-username.github.io/your-repo-name/smooth_scrolling/css/smooth-scrolling.css">
<script src="https://your-username.github.io/your-repo-name/smooth_scrolling/js/smooth-scrolling.js"></script>

<!-- Copy content from respective templates/ folders -->
```

### Method 2: All-in-One T123 Blocks
Copy the complete code from each component's `all-in-one-example.html` file.

## 🔧 Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Make changes to any component**
   ```bash
   # Edit files in component folders
   git add .
   git commit -m "Update component logic"
   git push origin main
   ```

3. **Changes are live immediately** on GitHub Pages

## ➕ Adding New Components

1. Create a new folder: `new_component/`
2. Add the same structure: `css/`, `js/`, `templates/`
3. Create component README.md
4. Add all-in-one-example.html
5. Update this main README with new URLs
6. Push to GitHub

## 🌟 Benefits

- ✅ **Single Repository**: Manage all components in one place
- ✅ **Organized Structure**: Clear separation of components
- ✅ **Easy URLs**: Predictable paths for each component
- ✅ **Version Control**: Track all component changes
- ✅ **Free Hosting**: GitHub Pages handles everything
- ✅ **Reusable**: Use across multiple Tilda sites
- ✅ **Maintainable**: Update once, deploy everywhere

## 📖 Documentation

Each component has its own detailed README:
- [`grade_calc/README.md`](grade_calc/README.md) - Grade Calculator documentation
- [`smooth_scrolling/README.md`](smooth_scrolling/README.md) - Smooth Scrolling documentation

For deployment instructions, see [`DEPLOYMENT.md`](DEPLOYMENT.md).