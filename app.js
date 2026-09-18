const fs = require('fs');
const path = require('path');

// ==========================================
// 1. Core Functions
// ==========================================

/**
 * Calculates the average grade for a single student.
 */
function getAverageGrade(student) {
  if (!student || !Array.isArray(student.grades) || student.grades.length === 0) {
    return 0;
  }
  const sum = student.grades.reduce((total, grade) => total + grade, 0);
  return sum / student.grades.length;
}

/**
 * Returns the top n students sorted by average grade in descending order.
 */
function getTopStudents(students, n) {
  if (!Array.isArray(students)) {
    throw new TypeError('First argument "students" must be an array.');
  }
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Second argument "n" must be a non-negative integer.');
  }

  return [...students]
    .map(student => ({
      ...student,
      averageGrade: getAverageGrade(student)
    }))
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, n);
}

/**
 * Groups all students by their course field.
 */
function groupByCourse(students) {
  if (!Array.isArray(students)) {
    throw new TypeError('Argument "students" must be an array.');
  }

  return students.reduce((acc, student) => {
    const course = student.course || 'Unassigned';
    if (!acc[course]) {
      acc[course] = [];
    }
    acc[course].push({ ...student });
    return acc;
  }, {});
}

/**
 * Counts currently enrolled vs not enrolled students.
 */
function getEnrolledCount(students) {
  if (!Array.isArray(students)) {
    throw new TypeError('Argument "students" must be an array.');
  }

  return students.reduce(
    (acc, student) => {
      if (student.enrolled) {
        acc.enrolled += 1;
      } else {
        acc.notEnrolled += 1;
      }
      return acc;
    },
    { enrolled: 0, notEnrolled: 0 }
  );
}

/**
 * Case-insensitive search for a student by name.
 */
function findStudent(students, name) {
  if (!Array.isArray(students)) {
    throw new TypeError('First argument "students" must be an array.');
  }
  if (typeof name !== 'string') {
    throw new TypeError('Second argument "name" must be a string.');
  }

  const query = name.trim().toLowerCase();
  if (query === '') return null;

  const matches = students.filter(
    s => typeof s.name === 'string' && s.name.trim().toLowerCase() === query
  );

  return matches.length > 0 ? { ...matches[0] } : null;
}

/**
 * Calculates average grade per course, sorted highest to lowest.
 */
function getCourseAverages(students) {
  if (!Array.isArray(students)) {
    throw new TypeError('Argument "students" must be an array.');
  }

  const grouped = groupByCourse(students);

  const averages = Object.keys(grouped).map(course => {
    const courseStudents = grouped[course];
    const totalAvg = courseStudents.reduce(
      (sum, s) => sum + getAverageGrade(s),
      0
    );
    const courseAvg = courseStudents.length > 0 ? totalAvg / courseStudents.length : 0;

    return {
      course,
      averageGrade: Number(courseAvg.toFixed(2))
    };
  });

  return averages.sort((a, b) => b.averageGrade - a.averageGrade);
}

/**
 * Constructs a summary object containing overall metrics.
 */
function exportSummary(students) {
  if (!Array.isArray(students) || students.length === 0) {
    return {
      totalStudents: 0,
      overallAverageGrade: 0,
      topStudent: null,
      courseBreakdown: []
    };
  }

  const totalStudents = students.length;

  // Flatten all grade arrays across all students to calculate overall dataset average
  const allGrades = students.reduce((acc, student) => {
    return Array.isArray(student.grades) ? acc.concat(student.grades) : acc;
  }, []);

  const overallAverageGrade =
    allGrades.length > 0
      ? Number((allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length).toFixed(2))
      : 0;

  const topStudents = getTopStudents(students, 1);
  const topStudent = topStudents.length > 0 ? topStudents[0] : null;

  return {
    totalStudents,
    overallAverageGrade,
    topStudent: topStudent
      ? {
          id: topStudent.id,
          name: topStudent.name,
          averageGrade: Number(topStudent.averageGrade.toFixed(2))
        }
      : null,
    courseBreakdown: getCourseAverages(students)
  };
}

// ==========================================
// 2. Sample Dataset Setup (Stretch Goal helper)
// ==========================================

const defaultStudentsData = [
  { id: 1, name: "Alice Johnson", year: 2, course: "Computer Science", grades: [88, 92, 95], enrolled: true },
  { id: 2, name: "Bob Smith", year: 3, course: "Mathematics", grades: [75, 80, 78], enrolled: false },
  { id: 3, name: "Charlie Davis", year: 1, course: "Computer Science", grades: [95, 98, 100], enrolled: true },
  { id: 4, name: "Diana Prince", year: 4, course: "Physics", grades: [82, 85, 90], enrolled: true },
  { id: 5, name: "Evan Wright", year: 2, course: "Physics", grades: [], enrolled: false },
  { id: 6, name: "Fiona Gallagher", year: 3, course: "Mathematics", grades: [91, 89, 94], enrolled: true },
  { id: 7, name: "George Clark", year: 1, course: "Computer Science", grades: [70, 74, 72], enrolled: true },
  { id: 8, name: "Hannah Abbott", year: 4, course: "Biology", grades: [88, 90, 87], enrolled: false },
  { id: 9, name: "Ian Malcolm", year: 2, course: "Biology", grades: [96, 94, 98], enrolled: true },
  { id: 10, name: "Julia Roberts", year: 3, course: "Physics", grades: [65, 70, 68], enrolled: true }
];

// ==========================================
// 3. Main Program Execution
// ==========================================

function main() {
  const jsonPath = path.join(__dirname, 'students.json');
  const reportPath = path.join(__dirname, 'report.json');

  // Auto-generate students.json with the 10 student records if it does not exist
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(defaultStudentsData, null, 2), 'utf8');
  }

  let students = [];

  // Read data from disk using fs.readFileSync
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    students = JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading students.json:', err.message);
    return;
  }

  console.log('====================================================');
  console.log('             STUDENT RECORDS REPORT                 ');
  console.log('====================================================\n');

  // Overall metrics & export summary
  const summary = exportSummary(students);
  console.log(`Total Student Count   : ${summary.totalStudents}`);
  console.log(`Overall Average Grade : ${summary.overallAverageGrade}`);

  // Top performing students
  console.log('\n--- Top 3 Students ---');
  try {
    const top3 = getTopStudents(students, 3);
    top3.forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.name} (${s.course}) - Avg Grade: ${s.averageGrade.toFixed(2)}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }

  // Enrollment counts
  const enrollment = getEnrolledCount(students);
  console.log('\n--- Enrollment Breakdown ---');
  console.log(`Enrolled     : ${enrollment.enrolled}`);
  console.log(`Not Enrolled : ${enrollment.notEnrolled}`);

  // Course average breakdown
  console.log('\n--- Average Grade by Course ---');
  const courseAverages = getCourseAverages(students);
  courseAverages.forEach(c => {
    console.log(`${c.course.padEnd(18)}: ${c.averageGrade}`);
  });

  // Name search demo
  console.log('\n--- Student Search Demonstration ---');
  const searchName = 'charlie davis';
  const match = findStudent(students, searchName);
  if (match) {
    console.log(`Query: "${searchName}" -> Found: ${match.name} (ID: ${match.id}, Course: ${match.course})`);
  } else {
    console.log(`Query: "${searchName}" -> No student found.`);
  }

  // Write summary report to report.json
  try {
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`\n[Success] Summary report written to report.json`);
  } catch (err) {
    console.error('Error writing report.json:', err.message);
  }

  console.log('\n====================================================');
}

main();