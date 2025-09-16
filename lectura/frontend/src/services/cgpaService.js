import api from './api';

const getSemesters = async () => {
    const response = await api.get('/cgpa/semesters');
    return response.data;
};

const createSemester = async (name) => {
    const response = await api.post('/cgpa/semesters', { name });
    return response.data;
};

const addCourse = async (courseData) => {
    const response = await api.post('/cgpa/courses', courseData);
    return response.data;
};

const calculateCumulativeCgpa = async () => {
    const response = await api.get('/cgpa/calculate/cumulative');
    return response.data;
};

const cgpaService = {
    getSemesters,
    createSemester,
    addCourse,
    calculateCumulativeCgpa,
};

export default cgpaService;
