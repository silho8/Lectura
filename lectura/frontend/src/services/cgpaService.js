import { supabase } from '../supabaseClient';

const gradeToPoint = (grade) => {
  switch (grade.toUpperCase()) {
    case 'A': return 5.0;
    case 'B': return 4.0;
    case 'C': return 3.0;
    case 'D': return 2.0;
    case 'E': return 1.0;
    case 'F': return 0.0;
    default: return 0.0;
  }
};

const getSemesters = async (userId) => {
  if (!userId) throw new Error("User not authenticated");
  const { data, error } = await supabase
    .from('semesters')
    .select('*, courses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

const createSemester = async (name, userId) => {
  if (!userId) throw new Error("User not authenticated");
  const { data, error } = await supabase
    .from('semesters')
    .insert({ name, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const addCourse = async (courseData, userId) => {
  if (!userId) throw new Error("User not authenticated");
  const { semester_id, course_code, credit_units, grade, is_retake } = courseData;
  const { data, error } = await supabase
    .from('courses')
    .insert({
      semester_id,
      user_id: userId,
      course_code,
      credit_units,
      grade,
      is_retake
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteSemester = async (semesterId) => {
  const { error } = await supabase
    .from('semesters')
    .delete()
    .eq('id', semesterId);

  if (error) throw error;
  return true;
};

const deleteCourse = async (courseId) => {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

    if (error) throw error;
    return true;
};


const calculateCgpaForSemesters = (semesters) => {
  if (!semesters || semesters.length === 0) {
    return { cumulativeGpa: '0.00', totalUnits: 0, semesterGpas: [] };
  }

  let totalQualityPoints = 0;
  let totalCreditUnits = 0;
  const takenCourses = new Set();

  const semesterGpas = semesters.map(semester => {
    let semesterQualityPoints = 0;
    let semesterCreditUnits = 0;

    semester.courses.forEach(course => {
      // For cumulative GPA, if a course is retaken, only count the highest grade
      if (takenCourses.has(course.course_code)) {
        // This is a simplified logic. A more robust implementation would
        // find the previous attempt and only include the better one in the cumulative calc.
        // For now, we'll just add it to semester GPA but be careful with cumulative.
      }

      const points = gradeToPoint(course.grade) * course.credit_units;
      semesterQualityPoints += points;
      semesterCreditUnits += course.credit_units;

      // This cumulative logic is basic. A proper one needs to handle retakes more gracefully.
      totalQualityPoints += points;
      totalCreditUnits += course.credit_units;
      takenCourses.add(course.course_code);
    });

    const semesterGpa = semesterCreditUnits > 0
      ? (semesterQualityPoints / semesterCreditUnits).toFixed(2)
      : '0.00';

    return { semesterId: semester.id, name: semester.name, gpa: semesterGpa };
  });

  const cumulativeGpa = totalCreditUnits > 0
    ? (totalQualityPoints / totalCreditUnits).toFixed(2)
    : '0.00';

  return { cumulativeGpa, totalUnits: totalCreditUnits, semesterGpas };
};


const cgpaService = {
  getSemesters,
  createSemester,
  addCourse,
  deleteSemester,
  deleteCourse,
  calculateCgpaForSemesters,
};

export default cgpaService;