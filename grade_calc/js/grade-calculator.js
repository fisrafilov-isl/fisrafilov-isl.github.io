// Grade Calculator - Reusable Component
//
// Source of truth: the "Grade Calc Configuration" Google Sheet agreed with Admissions.
// test/grade-calculator.test.js checks every row of it against this file.
//
// Yearly rollover: edit ACADEMIC_YEARS and PROGRAMMES_BY_YEAR, swap the test fixture,
// run the tests, re-minify. The result rows are rendered from ACADEMIC_YEARS, so the
// Tilda block never needs touching.
(function() {
  'use strict';

  // Keyed by the year the academic year starts: 2026 means 2026-2027
  const ACADEMIC_YEARS = [2026, 2027];

  // A child must have turned the right age by 1 September
  const CUTOFF_MONTH = 9;
  const YOUNGEST_AGE = 3; // Pre-Primary (3 y.o.)
  const MAX_GRADE = 12;

  const PRIMARY = ['IB PYP', 'Waldorf', 'Montessori'];

  const OFFER_2026 = {
    'Pre-Primary': PRIMARY,
    1: PRIMARY,
    2: PRIMARY,
    3: PRIMARY,
    4: PRIMARY,
    5: PRIMARY,
    6: ['IB MYP', 'Waldorf', 'Montessori'],
    7: ['IB MYP', 'Waldorf'],
    8: ['IB MYP', 'Waldorf'],
    9: ['IB MYP', 'IB E&T', 'Waldorf', 'TLF'],
    10: ['IB MYP', 'TLF'],
    11: ['IB DP', 'IB CP', 'TLF'],
    12: ['IB DP', 'IB CP']
  };

  const PROGRAMMES_BY_YEAR = {
    2026: OFFER_2026,
    // E&T's first cohort moves up into Grade 10
    2027: Object.assign({}, OFFER_2026, { 10: ['IB MYP', 'IB E&T', 'TLF'] })
  };

  const ADMISSIONS_EMAIL = 'admission@isl.cy';

  const PROGRAMME_LINKS = {
    'IB PYP': '/ibpyp',
    'IB MYP': '/ibmyp',
    'IB DP': '/ibdp',
    'IB CP': '/ibcp',
    'IB E&T': '/entprogramme',
    'TLF': '/techscholarship',
    'Waldorf': '/waldorf',
    'Montessori': '/montessori'
  };

  // Waldorf has a separate kindergarten page for ages 3-6
  const PRE_PRIMARY_LINKS = {
    'Waldorf': '/waldorfpreprimary'
  };

  // Tilda's DOB field gives dd-mm-yyyy (or with / or .). Already-ISO input passes through.
  function convertToISO(dateStr) {
    const parts = String(dateStr).trim().split(/[-/.]/);
    if (parts.length !== 3 || parts[0].length === 4) return dateStr;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Read year and month straight from the string. new Date('2008-09-01') is UTC
  // midnight, which is 31 August for anyone west of Greenwich.
  function parseISODate(iso) {
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(iso).trim());
    if (!match) return null;
    return { year: Number(match[1]), month: Number(match[2]) };
  }

  function calculateGrade(isoDate, targetYear) {
    const birth = parseISODate(isoDate);
    if (!birth) return '—';

    const ageOnCutoff = targetYear - birth.year - (birth.month >= CUTOFF_MONTH ? 1 : 0);

    if (ageOnCutoff >= YOUNGEST_AGE && ageOnCutoff <= 5) {
      return `Pre-Primary (${ageOnCutoff} y.o.)`;
    }

    const grade = ageOnCutoff - 5;
    if (grade >= 1 && grade <= MAX_GRADE) return `Grade ${grade}`;

    return '—';
  }

  function getPrograms(grade, targetYear) {
    const offer = PROGRAMMES_BY_YEAR[targetYear];
    if (!offer) return '—';

    const match = /^(?:(Pre-Primary)|Grade (\d+))/.exec(grade);
    if (!match) return '—';

    const programmes = offer[match[1] || Number(match[2])];
    return programmes ? programmes.join(', ') : '—';
  }

  // Oldest: Grade 12 in the first year. Youngest: Pre-Primary (3 y.o.) in the last.
  function dateBounds() {
    const first = ACADEMIC_YEARS[0];
    const last = ACADEMIC_YEARS[ACADEMIC_YEARS.length - 1];
    return {
      min: `${first - (MAX_GRADE + 6)}-09-01`,
      max: `${last - YOUNGEST_AGE}-08-31`
    };
  }

  function programmeLink(name, grade) {
    const prePrimary = grade.startsWith('Pre-Primary') && PRE_PRIMARY_LINKS[name];
    return prePrimary || PROGRAMME_LINKS[name] || '#';
  }

  function addProgramLinks(programString, grade) {
    if (programString === '—') return '—';

    const links = programString.split(/\s*,\s*/)
      .map(name => {
        const link = programmeLink(name, grade);
        return `<a href="${link}" class="program-link" target="_blank" rel="noopener">${name}</a>`;
      })
      .join('');
    return `<span class="program-list">${links}</span>`;
  }

  // Replace whatever year rows the page shipped with, so a stale Tilda block can't
  // show a year we no longer calculate.
  function renderYearRows() {
    const tbody = document.querySelector('#resultTable tbody');
    if (!tbody) return;

    tbody.innerHTML = ACADEMIC_YEARS.map(year => `
      <tr>
        <td>${year}-${year + 1}</td>
        <td id="grade${year}">—</td>
        <td id="program${year}">—</td>
      </tr>`).join('');
  }

  // Admissions (Sep 2026): the calculator signals the 1 September rule, but they
  // still consider edge cases, so say so instead of letting a dash end the conversation
  function renderNote() {
    const table = document.getElementById('resultTable');
    if (!table || document.getElementById('gradeCalcNote')) return;

    const note = document.createElement('p');
    note.id = 'gradeCalcNote';
    note.className = 'grade-results__note';
    note.innerHTML = 'Born close to 1 September or have unusual circumstances? ' +
      `Contact <a href="mailto:${ADMISSIONS_EMAIL}">${ADMISSIONS_EMAIL}</a> and we'll advise.`;
    table.insertAdjacentElement('afterend', note);
  }

  function updateGrades() {
    const dob = document.getElementById('gradecalc-dob');
    if (!dob || !dob.value) return;

    ACADEMIC_YEARS.forEach(year => {
      const grade = calculateGrade(dob.value, year);
      const programs = getPrograms(grade, year);

      const gradeElement = document.getElementById(`grade${year}`);
      const programElement = document.getElementById(`program${year}`);

      if (gradeElement) gradeElement.textContent = grade;
      if (programElement) programElement.innerHTML = addProgramLinks(programs, grade);
    });
  }

  function initGradeCalculator() {
    renderYearRows();
    renderNote();

    // Handle popup opener click
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('a[href="#popup:gradecalc"]')) {
        const mainDob = document.querySelector('input[name="DOB"]');
        const gradeInput = document.getElementById('gradecalc-dob');

        if (mainDob && gradeInput) {
          gradeInput.value = convertToISO(mainDob.value);
          if (gradeInput._flatpickr) {
            gradeInput._flatpickr.setDate(gradeInput.value);
          }
          updateGrades();
        }
      }
    });

    const dobInput = document.getElementById('gradecalc-dob');
    if (dobInput) {
      const bounds = dateBounds();
      if (typeof flatpickr !== 'undefined') {
        flatpickr(dobInput, {
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'd / m / Y',
          minDate: bounds.min,
          maxDate: bounds.max,
          defaultDate: dobInput.value || bounds.min,
          disableMobile: true,
          onChange: function() {
            updateGrades();
          }
        });
      } else {
        // Fallback to native date input
        dobInput.min = bounds.min;
        dobInput.max = bounds.max;
        dobInput.addEventListener('change', updateGrades);
      }
      updateGrades();
    }
  }

  // Node (tests): export the pure functions and skip the DOM
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ACADEMIC_YEARS,
      PROGRAMMES_BY_YEAR,
      PROGRAMME_LINKS,
      convertToISO,
      calculateGrade,
      getPrograms,
      programmeLink,
      dateBounds
    };
    return;
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGradeCalculator);
  } else {
    initGradeCalculator();
  }

  // Expose public API for manual initialization if needed
  window.GradeCalculator = {
    init: initGradeCalculator,
    updateGrades: updateGrades
  };

})();
