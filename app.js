'use strict';

// ===========================================================================
// STUDENT RECORDS DATA PROCESSOR (PURE JAVASCRIPT)
// No HTML, no CSS, no Node.js - works in any online JavaScript playground.
// Run with: node app.js  (or paste into an online editor and press Run)
// ===========================================================================

// ---------------------------------------------------------------------------
// Dataset: 32 hardcoded student records (JSON-style)
// ---------------------------------------------------------------------------

const students = [
  { id: 1,  name: "Maria Santos",       year: 3, course: "BS Computer Science",      grades: [92, 88, 95, 90, 93],       enrolled: true  },
  { id: 2,  name: "Juan Dela Cruz",     year: 2, course: "BS Mathematics",            grades: [85, 90, 78, 88, 82],       enrolled: true  },
  { id: 3,  name: "Ana Reyes",          year: 4, course: "BS Computer Science",      grades: [96, 94, 91, 98, 95],       enrolled: true  },
  { id: 4,  name: "Pedro Lim",          year: 1, course: "BS Physics",               grades: [88, 84, 90, 86, 89],       enrolled: false },
  { id: 5,  name: "Liza Morales",       year: 3, course: "BS Information Technology", grades: [79, 83, 81, 85, 80],       enrolled: true  },
  { id: 6,  name: "Carlos Garcia",      year: 2, course: "BS Mathematics",            grades: [91, 87, 93, 89, 90],       enrolled: true  },
  { id: 7,  name: "Bea Torres",         year: 1, course: "BS Computer Science",      grades: [84, 86, 82, 88, 85],       enrolled: true  },
  { id: 8,  name: "Miguel Ramos",       year: 4, course: "BS Physics",               grades: [95, 93, 97, 92, 96],       enrolled: true  },
  { id: 9,  name: "Sofia Aquino",       year: 2, course: "BS Information Technology", grades: [77, 81, 79, 84, 78],       enrolled: true  },
  { id: 10, name: "Rafael Mendoza",     year: 3, course: "BS Computer Science",      grades: [],                         enrolled: false },
  { id: 11, name: "Angela Cruz",        year: 2, course: "BS Biology",               grades: [90, 92, 94, 88, 91],       enrolled: true  },
  { id: 12, name: "Paolo Villanueva",   year: 4, course: "BS Information Technology", grades: [82, 85, 80, 88, 84],       enrolled: true  },
  { id: 13, name: "Katrina Bautista",   year: 1, course: "BS Biology",               grades: [87, 89, 91, 85, 90],       enrolled: true  },
  { id: 14, name: "Gabriel Santos",     year: 3, course: "BS Physics",               grades: [76, 80, 78, 82, 79],       enrolled: false },
  { id: 15, name: "Jasmine Flores",     year: 2, course: "BS Computer Science",      grades: [],                         enrolled: true  },
  { id: 16, name: "Mark Navarro",       year: 4, course: "BS Mathematics",            grades: [93, 90, 95, 92, 94],       enrolled: true  },
  { id: 17, name: "Camille Ocampo",     year: 1, course: "BS Information Technology", grades: [83, 86, 84, 88, 82],       enrolled: true  },
  { id: 18, name: "Joshua Ramirez",     year: 3, course: "BS Biology",               grades: [78, 82, 80, 85, 81],       enrolled: true  },
  { id: 19, name: "Nicole Fernandez",   year: 2, course: "BS Physics",               grades: [91, 88, 93, 90, 89],       enrolled: true  },
  { id: 20, name: "Patrick Domingo",    year: 4, course: "BS Computer Science",      grades: [86, 84, 89, 87, 85],       enrolled: true  },
  { id: 21, name: "Hannah Villar",      year: 1, course: "BS Mathematics",            grades: [80, 77, 83, 79, 82],       enrolled: false },
  { id: 22, name: "Christian Abad",     year: 3, course: "BS Information Technology", grades: [88, 90, 86, 92, 89],       enrolled: true  },
  { id: 23, name: "Alyanna Mendoza",    year: 2, course: "BS Biology",               grades: [84, 88, 82, 86, 87],       enrolled: true  },
  { id: 24, name: "Daniel Aquino",      year: 4, course: "BS Physics",               grades: [81, 79, 84, 80, 83],       enrolled: true  },
  { id: 25, name: "Elisa Salazar",      year: 1, course: "BS Computer Science",      grades: [93, 91, 96, 94, 92],       enrolled: true  },
  { id: 26, name: "Francis Tan",        year: 3, course: "BS Mathematics",            grades: [75, 78, 76, 80, 74],       enrolled: true  },
  { id: 27, name: "Julia Lim",          year: 2, course: "BS Information Technology", grades: [89, 87, 91, 90, 88],       enrolled: true  },
  { id: 28, name: "Vincent Cruz",       year: 1, course: "BS Biology",               grades: [79, 83, 81, 84, 80],       enrolled: true  },
  { id: 29, name: "Andrea Reyes",       year: 4, course: "BS Physics",               grades: [],                         enrolled: false },
  { id: 30, name: "Bryan Castillo",     year: 3, course: "BS Computer Science",      grades: [85, 82, 88, 84, 86],       enrolled: true  },
  { id: 31, name: "Chloe Ramos",        year: 2, course: "BS Mathematics",            grades: [92, 89, 95, 91, 93],       enrolled: true  },
  { id: 32, name: "Kevin Soriano",      year: 1, course: "BS Information Technology", grades: [82, 80, 84, 81, 85],       enrolled: true  }
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Total of grades divided by the number of grades (0 if no grades).
function averageOf(grades) {
  if (!Array.isArray(grades) || grades.length === 0) return 0;
  return grades.reduce(function (sum, grade) {
    return sum + grade;
  }, 0) / grades.length;
}

// Round to 2 decimals and render cleanly (drop trailing zeros).
function formatGrade(value) {
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

// Validation shared by functions that take a count.
function validateCount(name, n) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError(name + ': n must be a number.');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError(name + ': n must be a whole number, got ' + n + '.');
  }
  if (n < 0) {
    throw new RangeError(name + ': n cannot be negative (received ' + n + ').');
  }
}

// ---------------------------------------------------------------------------
// 1. getAverageGrade(student) - returns the student's average grade
// ---------------------------------------------------------------------------
function getAverageGrade(student) {
  if (!Array.isArray(student.grades)) {
    throw new TypeError('getAverageGrade: student.grades must be an array.');
  }
  return averageOf(student.grades);
}

// ---------------------------------------------------------------------------
// 2. getTopStudents(students, n) - top n students by average grade (desc)
// ---------------------------------------------------------------------------
function getTopStudents(students, n) {
  validateCount('getTopStudents', n);
  const withAverage = students.map(function (student) {
    return Object.assign({}, student, { average: getAverageGrade(student) });
  });
  return withAverage
    .sort(function (a, b) { return b.average - a.average; })
    .slice(0, n)
    .map(function (student) {
      const copy = Object.assign({}, student);
      delete copy.average;
      return copy;
    });
}

// ---------------------------------------------------------------------------
// 3. groupByCourse(students) - object keyed by course -> array of students
// ---------------------------------------------------------------------------
function groupByCourse(students) {
  return students.reduce(function (groups, student) {
    const key = student.course;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(student);
    return groups;
  }, {});
}

// ---------------------------------------------------------------------------
// 4. getEnrolledCount(students) - enrolled vs not enrolled
// ---------------------------------------------------------------------------
function getEnrolledCount(students) {
  const enrolled = students.filter(function (student) {
    return student.enrolled === true;
  }).length;
  return {
    enrolled: enrolled,
    notEnrolled: students.length - enrolled
  };
}

// ---------------------------------------------------------------------------
// 5. findStudent(students, name) - case-insensitive search, null if missing
// ---------------------------------------------------------------------------
function findStudent(students, name) {
  const target = String(name).toLowerCase();
  const matches = students.filter(function (student) {
    return student.name.toLowerCase().includes(target);
  });
  return matches.length > 0 ? Object.assign({}, matches[0]) : null;
}

// ---------------------------------------------------------------------------
// 6. getCourseAverages(students) - per-course average, highest to lowest
// ---------------------------------------------------------------------------
function getCourseAverages(students) {
  const courses = groupByCourse(students);
  return Object.keys(courses)
    .map(function (course) {
      const allGrades = courses[course].reduce(function (list, student) {
        return list.concat(student.grades);
      }, []);
      return {
        course: course,
        average: averageOf(allGrades)
      };
    })
    .sort(function (a, b) { return b.average - a.average; });
}

// ---------------------------------------------------------------------------
// 7. exportSummary(students) - single summary object
// ---------------------------------------------------------------------------
function exportSummary(students) {
  const allGrades = students.reduce(function (list, student) {
    return list.concat(student.grades);
  }, []);
  const overall = averageOf(allGrades);
  const courseStats = getCourseAverages(students);
  const top = getTopStudents(students, 1)[0] || null;
  return {
    totalStudents: students.length,
    overallAverage: Number(overall.toFixed(2)),
    topPerformingStudent: top ? top.name : null,
    byCourse: courseStats.reduce(function (result, item) {
      result[item.course] = Number(item.average.toFixed(2));
      return result;
    }, {})
  };
}

// ---------------------------------------------------------------------------
// Stretch: filterByYear(students, year) - students in a given year level
// ---------------------------------------------------------------------------
function filterByYear(students, year) {
  validateCount('filterByYear', year);
  return students
    .filter(function (student) { return student.year === year; })
    .map(function (student) { return Object.assign({}, student); });
}

// ---------------------------------------------------------------------------
// Stretch: sortByName(students) - students sorted alphabetically by name
// ---------------------------------------------------------------------------
function sortByName(students) {
  return students
    .map(function (student) { return Object.assign({}, student); })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
function printReport(data) {
  const students = data.students;
  console.log('============================================================');
  console.log('STUDENT RECORDS DATA PROCESSOR - REPORT');
  console.log('============================================================');

  // Total student count
  console.log('TOTAL STUDENTS: ' + data.totalStudents);
  console.log('OVERALL AVERAGE GRADE: ' + formatGrade(data.overallAverage));

  // Enrolled vs not enrolled
  const enrollment = getEnrolledCount(students);
  console.log('ENROLLMENT: ' + enrollment.enrolled + ' enrolled | ' +
    enrollment.notEnrolled + ' not enrolled');

  // Top performing students
  console.log('');
  console.log('TOP PERFORMING STUDENTS (Top 5)');
  console.log('------------------------------------------------------------');
  const topFive = getTopStudents(students, 5);
  if (topFive.length === 0) {
    console.log('No students in the dataset.');
  } else {
    topFive.forEach(function (student, index) {
      console.log((index + 1) + '. ' + student.name + ' (' + student.course +
        ') - Average: ' + formatGrade(getAverageGrade(student)));
    });
  }

  // Average grade by course, sorted highest to lowest
  console.log('');
  console.log('AVERAGE GRADE BY COURSE (highest to lowest)');
  console.log('------------------------------------------------------------');
  const courseAverages = getCourseAverages(students);
  if (courseAverages.length === 0) {
    console.log('No courses in the dataset.');
  } else {
    courseAverages.forEach(function (item) {
      console.log(item.course + ': ' + formatGrade(item.average));
    });
  }

  // Students grouped by course
  console.log('');
  console.log('STUDENTS GROUPED BY COURSE');
  console.log('------------------------------------------------------------');
  const groups = groupByCourse(students);
  const courseNames = Object.keys(groups);
  if (courseNames.length === 0) {
    console.log('No students in the dataset.');
  } else {
    courseNames.forEach(function (course) {
      console.log(course + ' (' + groups[course].length + ' students)');
      groups[course].forEach(function (student) {
        console.log('  - ' + student.name + ' (Year ' + student.year + ')');
      });
    });
  }

  // Search examples
  console.log('');
  console.log('SEARCH EXAMPLES (case-insensitive)');
  console.log('------------------------------------------------------------');
  ['ANA REYES', 'sofia', 'chloe ramos', 'LeBron James'].forEach(function (query) {
    const found = findStudent(students, query);
    console.log('Search "' + query + '": ' + (found ? 'found - ' + found.name : 'not found (null)'));
  });

  // Edge cases
  console.log('');
  console.log('EDGE CASES');
  console.log('------------------------------------------------------------');
  console.log('Average for Rafael Mendoza (no grades): ' +
    getAverageGrade(students[9]));
  console.log('getTopStudents(students, 0): ' +
    getTopStudents(students, 0).length + ' results');
  console.log('Top 3 of empty array with n=3: ' +
    getTopStudents([], 3).length + ' results');

  // Stretch: filterByYear
  console.log('');
  console.log('STRETCH - FILTER BY YEAR (Year 1)');
  console.log('------------------------------------------------------------');
  const yearOne = filterByYear(students, 1);
  console.log('Number of Year 1 students: ' + yearOne.length);
  console.log('Names: ' + yearOne.map(function (s) { return s.name; }).join(', '));

  // Stretch: sortByName
  console.log('');
  console.log('STRETCH - SORT BY NAME (alphabetical)');
  console.log('------------------------------------------------------------');
  console.log(sortByName(students).map(function (s) { return s.name; }).join(', '));

  // Export summary
  console.log('');
  console.log('EXPORT SUMMARY');
  console.log('------------------------------------------------------------');
  console.log(JSON.stringify(data.summary, null, 2));
}

// ---------------------------------------------------------------------------
// main() - runs every function and prints the report
// ---------------------------------------------------------------------------
function main() {
  const summary = exportSummary(students);
  printReport({
    students: students,
    summary: summary,
    totalStudents: summary.totalStudents,
    overallAverage: summary.overallAverage
  });

  // Input validation demo
  console.log('');
  console.log('INPUT VALIDATION TESTS');
  console.log('------------------------------------------------------------');
  let message;
  try {
    getTopStudents(students, -1);
    message = 'no error thrown';
  } catch (error) {
    message = error.name + ': ' + error.message;
  }
  console.log('getTopStudents(students, -1) -> ' + message);

  try {
    getTopStudents(students, 2.5);
    message = 'no error thrown';
  } catch (error) {
    message = error.name + ': ' + error.message;
  }
  console.log('getTopStudents(students, 2.5) -> ' + message);
}

main();
