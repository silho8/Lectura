import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import cgpaService from '../services/cgpaService';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import { FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cgpa = () => {
    const { user } = useAuth();
    const [semesters, setSemesters] = useState([]);
    const [cgpa, setCgpa] = useState('0.00');
    const [loading, setLoading] = useState(true);
    const [newSemesterName, setNewSemesterName] = useState('');
    const [newCourses, setNewCourses] = useState({}); // { semesterId: { course_code, credit_units, grade } }

    const fetchCgpaData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await cgpaService.getSemesters(user.id);
            setSemesters(data);
            const calc = cgpaService.calculateCgpaForSemesters(data);
            setCgpa(calc.cumulativeGpa);
        } catch (error) {
            toast.error('Failed to load CGPA data.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCgpaData();
    }, [fetchCgpaData]);

    const handleAddSemester = async (e) => {
        e.preventDefault();
        if (!newSemesterName.trim()) return;
        const toastId = toast.loading('Adding semester...');
        try {
            await cgpaService.createSemester(newSemesterName, user.id);
            setNewSemesterName('');
            toast.success('Semester added!', { id: toastId });
            fetchCgpaData();
        } catch (error) {
            toast.error('Failed to add semester.', { id: toastId });
        }
    };

    const handleAddCourse = async (e, semesterId) => {
        e.preventDefault();
        const course = newCourses[semesterId];
        if (!course || !course.course_code || !course.credit_units || !course.grade) {
            toast.error('All course fields are required.');
            return;
        }
        const toastId = toast.loading('Adding course...');
        try {
            await cgpaService.addCourse({ ...course, semester_id: semesterId }, user.id);
            setNewCourses(prev => ({ ...prev, [semesterId]: {} }));
            toast.success('Course added!', { id: toastId });
            fetchCgpaData();
        } catch (error) {
            toast.error('Failed to add course.', { id: toastId });
        }
    };

    const handleDeleteCourse = async (courseId) => {
        const toastId = toast.loading('Deleting course...');
        try {
            await cgpaService.deleteCourse(courseId);
            toast.success('Course deleted!', { id: toastId });
            fetchCgpaData();
        } catch (error) {
            toast.error('Failed to delete course.', { id: toastId });
        }
    };

    const handleCourseInputChange = (semesterId, field, value) => {
        setNewCourses(prev => ({
            ...prev,
            [semesterId]: {
                ...prev[semesterId],
                [field]: value,
            },
        }));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <h1 className="text-5xl font-pixel text-accent mb-2">CGPA Tracker</h1>
                    <p className="text-text-light text-lg">Manage your academic performance.</p>
                </div>
                <div className="bg-base-200 p-4 border-2 border-primary shadow-pixel-sm-primary mt-4 md:mt-0">
                    <p className="font-pixel text-2xl text-primary">CUMULATIVE GPA</p>
                    <p className="font-pixel text-7xl text-accent text-center">{cgpa}</p>
                </div>
            </div>

            {/* Add Semester Form */}
            <div className="bg-base-200 p-6 border-2 border-base-300 shadow-pixel-sm mb-8">
                <form onSubmit={handleAddSemester} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full md:flex-grow">
                        <FormInput
                            id="new-semester"
                            label="Add New Semester"
                            value={newSemesterName}
                            onChange={(e) => setNewSemesterName(e.target.value)}
                            placeholder="e.g., Year 1, Semester 2"
                        />
                    </div>
                    <FormButton type="submit" isLoading={loading} fullWidth={false}><FaPlus className="mr-2" /> Add</FormButton>
                </form>
            </div>

            {/* Semesters List */}
            <div className="space-y-8">
                {semesters.map(semester => (
                    <div key={semester.id} className="bg-base-200 p-6 border-2 border-base-300">
                        <h2 className="font-pixel text-3xl text-secondary mb-4">{semester.name}</h2>
                        <ul className="space-y-2 mb-4">
                            {semester.courses.map(course => (
                                <li key={course.id} className="flex justify-between items-center bg-base-300 p-2">
                                    <span className="font-sans">{course.course_code} ({course.credit_units} units) - Grade: {course.grade}</span>
                                    <button onClick={() => handleDeleteCourse(course.id)} className="text-error hover:text-red-400"><FaTrash /></button>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={(e) => handleAddCourse(e, semester.id)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <FormInput id={`cc-${semester.id}`} label="Course Code" value={newCourses[semester.id]?.course_code || ''} onChange={e => handleCourseInputChange(semester.id, 'course_code', e.target.value)} placeholder="e.g. ENG101" />
                            <FormInput id={`cu-${semester.id}`} label="Credit Units" type="number" value={newCourses[semester.id]?.credit_units || ''} onChange={e => handleCourseInputChange(semester.id, 'credit_units', e.target.value)} placeholder="e.g. 3" />
                             <FormInput id={`gr-${semester.id}`} label="Grade" value={newCourses[semester.id]?.grade || ''} onChange={e => handleCourseInputChange(semester.id, 'grade', e.target.value.toUpperCase())} placeholder="A, B, C..." />
                            <FormButton type="submit" fullWidth={true}><FaPlus /></FormButton>
                        </form>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Cgpa;