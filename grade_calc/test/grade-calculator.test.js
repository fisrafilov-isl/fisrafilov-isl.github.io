// Run: node --test grade_calc/test/grade-calculator.test.js
// The fixture is the admissions-approved "Grade Calc Configuration" sheet
// (Google Sheet, confirmed by Carmen on 14 Oct 2026 with one change: drop Forest School).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const calc = require('../js/grade-calculator.js');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REMOVED_PROGRAMMES = ['Forest School'];

function parseCsv(text) {
  return text.trim().split(/\r?\n/).map(line =>
    [...line.matchAll(/("([^"]*)"|[^,]*)(,|$)/g)]
      .filter(m => m[0] !== '')
      .map(m => m[2] !== undefined ? m[2] : m[1])
  );
}

const [header, ...rows] = parseCsv(
  fs.readFileSync(path.join(__dirname, 'fixtures/grades_by_year_2026-2028.csv'), 'utf8')
);
// Columns: Birth Year, Birth Month, then (Grade, Programs) per academic year
const sheetYears = header.slice(2).filter((_, i) => i % 2 === 0).map(h => Number(h.slice(0, 4)));

function expectedProgrammes(cell) {
  if (cell === '—') return '—';
  return cell.split(/\s*,\s*/).filter(p => !REMOVED_PROGRAMMES.includes(p)).join(', ');
}

function lastDayOfMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

test('calculator covers exactly the academic years in the sheet', () => {
  assert.deepEqual(calc.ACADEMIC_YEARS, sheetYears);
});

test('fixture is the full 2008-Jan..2024-Dec grid', () => {
  assert.equal(rows.length, 204);
  assert.deepEqual(rows[0].slice(0, 2), ['2008', 'Jan']);
  assert.deepEqual(rows.at(-1).slice(0, 2), ['2024', 'Dec']);
});

test('every sheet row matches the calculator, first and last day of the month', () => {
  for (const row of rows) {
    const birthYear = Number(row[0]);
    const month = MONTHS.indexOf(row[1]) + 1;
    assert.ok(month > 0, `bad month ${row[1]}`);

    for (const day of [1, lastDayOfMonth(birthYear, month)]) {
      const iso = `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      sheetYears.forEach((year, i) => {
        const grade = calc.calculateGrade(iso, year);
        const label = `${iso} in ${year}-${year + 1}`;
        assert.equal(grade, row[2 + i * 2], `grade for ${label}`);
        assert.equal(calc.getPrograms(grade, year), expectedProgrammes(row[3 + i * 2]), `programmes for ${label}`);
      });
    }
  }
});

test('Forest School is never offered', () => {
  for (const year of calc.ACADEMIC_YEARS) {
    for (const grade of ['Pre-Primary (3 y.o.)', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)]) {
      assert.ok(!calc.getPrograms(grade, year).includes('Forest'), `${grade} ${year}`);
    }
  }
});

test('1 September cut-off', () => {
  assert.equal(calc.calculateGrade('2020-08-31', 2026), 'Grade 1');
  assert.equal(calc.calculateGrade('2020-09-01', 2026), 'Pre-Primary (5 y.o.)');
  assert.equal(calc.calculateGrade('2024-08-31', 2027), 'Pre-Primary (3 y.o.)');
  assert.equal(calc.calculateGrade('2024-09-01', 2027), '—');
  assert.equal(calc.calculateGrade('2008-08-31', 2026), '—');
  assert.equal(calc.calculateGrade('2008-09-01', 2026), 'Grade 12');
});

test('date picker bounds cover every birth date that has a grade', () => {
  assert.deepEqual(calc.dateBounds(), { min: '2008-09-01', max: '2024-08-31' });
});

test('every programme has a real link', () => {
  for (const year of calc.ACADEMIC_YEARS) {
    for (const list of Object.values(calc.PROGRAMMES_BY_YEAR[year])) {
      for (const name of list) assert.ok(calc.PROGRAMME_LINKS[name], `no link for ${name}`);
    }
  }
});

test('convertToISO handles Tilda formats and leaves ISO alone', () => {
  assert.equal(calc.convertToISO('01-09-2015'), '2015-09-01');
  assert.equal(calc.convertToISO('1/9/2015'), '2015-09-01');
  assert.equal(calc.convertToISO('01.09.2015'), '2015-09-01');
  assert.equal(calc.convertToISO('2015-09-01'), '2015-09-01');
  assert.equal(calc.convertToISO(''), '');
});

test('garbage input gives a dash, not a crash', () => {
  assert.equal(calc.calculateGrade('', 2026), '—');
  assert.equal(calc.calculateGrade('not a date', 2026), '—');
  assert.equal(calc.getPrograms('—', 2026), '—');
});
