// Grade Calculator - Reusable Component
(function() {
  'use strict';

  // Date format conversion for Tilda
  function convertToISO(dateStr) {
    const parts = dateStr.replace(/-/g, "/").split("/");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  // Academic Year Configuration
  const academicConfig = {
    2025: {
      cutoffMonth: 8,
      exceptions: {},
      maxGrade: 12
    },
    2026: {
      cutoffMonth: 8,
      exceptions: {},
      maxGrade: 12
    }
  };

  // Program Configuration
  const programRules = {
    'Pre-Primary': ['IB', 'Waldorf', 'Montessori'],
    '1-3': ['IB', 'Waldorf', 'Montessori'],
    '4': year => year === 2026 ? ['IB', 'Waldorf', 'Montessori'] : ['IB', 'Waldorf'],
    '5-7': year => ['IB', 'Waldorf'],
    '8': year => ['IB', 'Waldorf'],
    '9-10': year => ['IB', 'IB E&T'],
    '11': year => ['IB DP'],
    '12': year => ['IB CP']
  };

  // Grade Calculation
  function calculateGrade(birthDate, targetYear) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const config = academicConfig[targetYear];
    
    if (config.exceptions[birthYear] && birthMonth > config.exceptions[birthYear].afterMonth) {
      return `Grade ${config.exceptions[birthYear].grade}`;
    }

    const gradeLevel = targetYear - birthYear - (birthMonth > config.cutoffMonth ? 1 : 0);

    if (gradeLevel >= 3 && gradeLevel <= 5) {
      return `Pre-Primary (${gradeLevel} y.o.)`;
    }

    if (gradeLevel >= 6) {
      const actualGrade = gradeLevel - 5;
      return actualGrade <= config.maxGrade ? `Grade ${actualGrade}` : '—';
    }

    return '—';
  }

  // Program Determination
  function getPrograms(grade, targetYear) {
    if (grade === '—') return '—';
    
    const match = grade.match(/Pre-Primary|Grade (\d+)/);
    if (!match) return '—';
    
    const [_, gradeNum] = match;
    if (!gradeNum) return programRules['Pre-Primary'].join(', ');

    let programKey;
    if (gradeNum >= 11) {
      programKey = gradeNum.toString();
    } else {
      programKey = Object.keys(programRules).find(key => {
        const [min, max] = key.split('-').map(Number);
        return gradeNum >= min && gradeNum <= (max || min);
      });
    }

    const programs = programKey ? 
      (typeof programRules[programKey] === 'function' 
        ? programRules[programKey](targetYear)
        : programRules[programKey]) 
      : null;

    if (gradeNum >= 11) {
      return ['IB DP', 'IB CP'].join(', ');
    }

    return programs?.join(', ') || '—';
  }

  // Program Links
  const programLinks = {
    'IB': '/ib',
    'IB DP': '/ib',
    'IB CP': '/ib',
    'IB E&T': '/ib',
    'Waldorf': '/waldorf',
    'Montessori': '/montessori'
  };

  function addProgramLinks(programString) {
    if (programString === '—') return '—';
    
    return programString.split(/\s*,\s*/)
      .map(name => {
        const link = programLinks[name] || '#';
        return `<a href="${link}" class="program-link" target="_blank" rel="noopener">${name}</a>`;
      })
      .join(' ');
  }

  // Update Display
  function updateGrades() {
    const dob = document.getElementById('gradecalc-dob');
    if (!dob || !dob.value) return;
    
    const birthDate = new Date(dob.value);
    
    [2025, 2026].forEach(year => {
      const grade = calculateGrade(birthDate, year);
      const programs = getPrograms(grade, year);
      
      const gradeElement = document.getElementById(`grade${year}`);
      const programElement = document.getElementById(`program${year}`);
      
      if (gradeElement) gradeElement.textContent = grade;
      if (programElement) programElement.innerHTML = addProgramLinks(programs);
    });
  }

  // Initialize the calculator
  function initGradeCalculator() {
    // Handle popup opener click
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('a[href="#popup:gradecalc"]')) {
        const mainDob = document.querySelector('input[name="DOB"]');
        const gradeInput = document.getElementById('gradecalc-dob');
        
        if (mainDob && gradeInput) {
          gradeInput.value = convertToISO(mainDob.value);
          updateGrades();
        }
      }
    });

    // Handle date input changes
    const dobInput = document.getElementById('gradecalc-dob');
    if (dobInput) {
      dobInput.addEventListener('change', updateGrades);
      updateGrades();
    }
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