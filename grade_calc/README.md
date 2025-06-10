# Grade Calculator Component

A reusable grade calculator for Tilda websites that calculates student grades and program eligibility based on birth date and academic year.

## 📁 Component Files

- **CSS**: `css/grade-calculator.css` - All styling
- **CSS (Minified)**: `css/grade-calculator.min.css` - Production-ready version
- **JavaScript**: `js/grade-calculator.js` - All functionality  
- **JavaScript (Minified)**: `js/grade-calculator.min.js` - Production-ready version
- **Template**: `templates/grade-calculator-template.html` - HTML structure
- **All-in-One**: `all-in-one-example.html` - Complete implementation in single file

## 🌐 GitHub Pages URLs

**Live URLs (Standard):**

```
https://fisrafilov-isl.github.io/grade_calc/css/grade-calculator.css
https://fisrafilov-isl.github.io/grade_calc/js/grade-calculator.js
```

**Live URLs (Minified - Recommended for Production):**

```
https://fisrafilov-isl.github.io/grade_calc/css/grade-calculator.min.css
https://fisrafilov-isl.github.io/grade_calc/js/grade-calculator.min.js
```

## 📋 Implementation in Tilda

### Method 1: External Files (Recommended)

Add this to your T123 block:

```html
<link rel="stylesheet" href="https://fisrafilov-isl.github.io/grade_calc/css/grade-calculator.min.css">
<script src="https://fisrafilov-isl.github.io/grade_calc/js/grade-calculator.min.js"></script>

<!-- GRADE CALCULATOR - REUSABLE TEMPLATE -->
<div id="gradeCalcBlock" class="grade-calculator r t-rec t-rec_pt_90 t-rec_pb_90">
  <div class="grade-calculator__container t-container" id="GradeCalcDiv">
    <header class="grade-calculator__header">
      <h2 class="grade-calculator__heading">GRADES AND PROGRAMS</h2>
      <p class="grade-calculator__description">
        What grade will your child enter in the<br>
        Academic Years 2024-2025 &amp; 2025-2026?
      </p>
    </header>

    <form id="gradeCalcForm" class="grade-calculator__form t-form">
      <div class="date-input-group t-input-group t-input-group_da">
        <label for="gradecalc-dob" class="date-input-label t-input-title t-descr t-descr_md">
          Child's date of birth:
        </label>
        <div class="date-input-wrapper t-input-block">
          <div class="t-datepicker__wrapper">
            <input type="date"
                   name="birthdate"
                   id="gradecalc-dob"
                   class="date-input t-input"
                   autocomplete="off"
                   min="2007-01-01"
                   max="2022-12-31"
                   value="2007-01-01">
          </div>
        </div>
      </div>
    </form>

    <div class="grade-results__wrapper">
      <table class="grade-results" id="resultTable">
        <thead>
          <tr>
            <th>Academic Year</th>
            <th>Grade</th>
            <th>Programs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-2025</td>
            <td id="grade2024">—</td>
            <td id="program2024">—</td>
          </tr>
          <tr>
            <td>2025-2026</td>
            <td id="grade2025">—</td>
            <td id="program2025">—</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="t-form__submit">
      <a href="#popup:generalapplication" 
         class="back-to-form-btn t-submit"
         role="button" 
         aria-haspopup="dialog">
        GO BACK TO FORM
      </a>
    </div>
  </div>
</div>
```

### Method 2: All-in-One Block

Copy all CSS, HTML, and JavaScript from `all-in-one-example.html` into a single T123 block.

## ⚙️ Features

- **Auto-population**: Reads DOB from main form `input[name="DOB"]`
- **Real-time calculation**: Updates grades when date changes
- **Program links**: Clickable program names that link to relevant pages
- **Responsive design**: Works on all devices
- **Tilda integration**: Works with Tilda popups and forms
- **Multiple implementations**: Choose between external files or all-in-one approach

## 🔧 Customization

### Update Academic Years

The calculator currently supports 2024-2025 and 2025-2026 academic years. To update for future years, edit the `academicConfig` object in `js/grade-calculator.js`:

```javascript
const academicConfig = {
  2025: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 },
  2026: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 },
  // Add new years as needed
};
```

**Note**: You'll also need to update the HTML table structure to display the new academic years.

### Modify Program Rules

Update `programRules` in `js/grade-calculator.js`:

```javascript
const programRules = {
  '4': year => ['IB', 'Waldorf'], // No Montessori for grade 4
  // ... other grades
};
```

### Change Program Links

Update `programLinks` in `js/grade-calculator.js`:

```javascript
const programLinks = {
  'IB': '/ib-program',
  'Waldorf': '/waldorf-program',
  'Montessori': '/montessori-program'
};
```

## 🎨 Styling

Modify CSS variables in `css/grade-calculator.css`:

```css
.grade-calculator {
  --primary-color: #ffffff;
  --accent-color: #ea5f00;
  --border-radius: 100px;
}
```

## 🔗 Integration

The calculator automatically integrates with forms containing `input[name="DOB"]`. When users click a link with `href="#popup:gradecalc"`, it will auto-populate and calculate.

### Popup Trigger Setup

In your main form, add a link like this:

```html
<a href="#popup:gradecalc">Click here to see grades and programs</a>
```

The component will automatically:
1. Detect the click
2. Copy the DOB from the main form
3. Calculate and display grades
4. Show relevant programs with links

## 📝 Notes

- Requires Tilda T123 HTML block
- No server-side dependencies
- Pure JavaScript (no external libraries)
- Works with Tilda's popup system
- Minified versions available for production use

## 🔄 Version History

- **v1.0**: Initial release with 2024-2025 and 2025-2026 academic years
- **v1.1**: Added minified files for production use
- **v1.2**: Enhanced program rules and links functionality

## 🚀 Performance

- **CSS**: ~7KB unminified, ~2KB minified
- **JavaScript**: ~6KB unminified, ~2KB minified
- **Dependencies**: None (pure JavaScript)
- **Browser Support**: All modern browsers 