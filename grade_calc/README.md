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
        Academic Years 2026-2027 &amp; 2027-2028?
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
                   min="2008-09-01"
                   max="2024-08-31">
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
          <!-- Rows are rendered by grade-calculator.js -->
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

### Yearly update

The programme offer comes from the "Grade Calc Configuration" Google Sheet that Admissions signs off. To roll the calculator forward:

1. Export the sheet's `grades_by_year` tab as CSV into `test/fixtures/` and point the test at it.
2. In `js/grade-calculator.js`, update `ACADEMIC_YEARS` and `PROGRAMMES_BY_YEAR` (and `PROGRAMME_LINKS` if a programme is added).
3. Run `node --test grade_calc/test/grade-calculator.test.js` until it passes. It checks every sheet row on the first and last day of each month.
4. Re-minify: `npx terser@5.36.0 js/grade-calculator.js -c -m -o js/grade-calculator.min.js`.
5. Commit and push. GitHub Pages serves the new file within about 10 minutes.

The result rows are rendered by the script from `ACADEMIC_YEARS`, so the Tilda block on isl.cy/admission never needs editing for a year change.

Current offer (2026-2027 and 2027-2028): Forest School is deliberately absent (Admissions, 14 Oct 2026). It is part of the Primary curriculum, not a programme families choose.

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
- **v2.0**: 2026-2027 and 2027-2028; IB pathways split (PYP, MYP, DP, CP, E&T), TLF added, Forest School removed; rows rendered from config; birth dates parsed timezone-safe; tests against the Admissions sheet

## 🚀 Performance

- **CSS**: ~7KB unminified, ~2KB minified
- **JavaScript**: ~6KB unminified, ~2KB minified
- **Dependencies**: None (pure JavaScript)
- **Browser Support**: All modern browsers 