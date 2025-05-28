# Grade Calculator Component

A reusable grade calculator for Tilda websites that calculates student grades and program eligibility based on birth date and academic year.

## 📁 Component Files

- **CSS**: `css/grade-calculator.css` - All styling
- **JavaScript**: `js/grade-calculator.js` - All functionality  
- **Template**: `templates/grade-calculator-template.html` - HTML structure

## 🌐 GitHub Pages URLs

**Live URLs:**

```
https://fisrafilov-isl.github.io/grade_calc/css/grade-calculator.css
https://fisrafilov-isl.github.io/grade_calc/js/grade-calculator.js
```

## 📋 Implementation in Tilda

### Method 1: External Files (Recommended)

Add this to your T123 block:

```html
<link rel="stylesheet" href="https://fisrafilov-isl.github.io/grade_calc/css/grade-calculator.css">
<script src="https://fisrafilov-isl.github.io/grade_calc/js/grade-calculator.js"></script>

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

Copy all CSS, HTML, and JavaScript into a single T123 block (see `all-in-one-example.html`).

## ⚙️ Features

- **Auto-population**: Reads DOB from main form `input[name="DOB"]`
- **Real-time calculation**: Updates grades when date changes
- **Program links**: Clickable program names that link to relevant pages
- **Responsive design**: Works on all devices
- **Tilda integration**: Works with Tilda popups and forms

## 🔧 Customization

### Update Academic Years

Edit the `academicConfig` object in `js/grade-calculator.js`:

```javascript
const academicConfig = {
  2025: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 },
  2026: { cutoffMonth: 8, exceptions: {...}, maxGrade: 12 }
};
```

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

## 📝 Notes

- Requires Tilda T123 HTML block
- No server-side dependencies
- Pure JavaScript (no external libraries)
- Works with Tilda's popup system 