import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import cgpaService from '../services/cgpaService';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const CgpaPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for adding a new semester
    const [newSemesterName, setNewSemesterName] = useState('');

    // State for adding a new course
    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [units, setUnits] = useState('');
    const [gradeRaw, setGradeRaw] = useState('');

    // State for results
    const [cumulativeGpa, setCumulativeGpa] = useState(null);

    const fetchSemesters = useCallback(async () => {
        setLoading(true);
        try {
            const data = await cgpaService.getSemesters();
            setSemesters(data.semesters);
            if (data.semesters.length > 0 && !selectedSemester) {
                setSelectedSemester(data.semesters[0]);
            }
        } catch (err) {
            setError('Failed to fetch semesters.');
        } finally {
            setLoading(false);
        }
    }, [selectedSemester]);

    const fetchCumulativeGpa = useCallback(async () => {
        try {
            const data = await cgpaService.calculateCumulativeCgpa();
            setCumulativeGpa(data);
        } catch (err) {
            console.error("Failed to fetch cumulative GPA");
        }
    }, []);


    useEffect(() => {
        fetchSemesters();
        fetchCumulativeGpa();
    }, [fetchSemesters, fetchCumulativeGpa]);

    const handleAddSemester = async (e) => {
        e.preventDefault();
        try {
            await cgpaService.createSemester(newSemesterName);
            setNewSemesterName('');
            fetchSemesters(); // Refetch
        } catch (err) {
            setError('Failed to add semester.');
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!selectedSemester) {
            setError("Please select a semester first.");
            return;
        }
        try {
            await cgpaService.addCourse({
                semester_id: selectedSemester.id,
                course_code: courseCode,
                course_title: courseTitle,
                units: parseInt(units),
                grade_raw: gradeRaw
            });
            // Clear form and refetch
            setCourseCode('');
            setCourseTitle('');
            setUnits('');
            setGradeRaw('');
            fetchSemesters();
            fetchCumulativeGpa();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add course.');
        }
    };

    const chartData = semesters.map(s => ({
        name: s.name,
        // This is a simplified calculation on the frontend for the chart
        // A proper implementation might fetch this from the backend per semester
        gpa: (s.courses.reduce((acc, c) => acc + (c.units * c.grade_point), 0) / s.courses.reduce((acc, c) => acc + c.units, 0) || 0).toFixed(2)
    }));

    return (
        <DashboardLayout>
            <Header title="CGPA Calculator" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Semesters and Add Course */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Semester List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4">Semesters</h3>
                            <ul className="space-y-2">
                                {semesters.map(s => (
                                    <li key={s.id}>
                                        <button
                                            onClick={() => setSelectedSemester(s)}
                                            className={`w-full text-left px-4 py-2 rounded-lg ${selectedSemester?.id === s.id ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}
                                        >
                                            {s.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                             <form onSubmit={handleAddSemester} className="mt-4 flex gap-2">
                                <FormInput id="newSemester" value={newSemesterName} onChange={e => setNewSemesterName(e.target.value)} placeholder="New semester name" />
                                <button type="submit" className="bg-brand-blue text-white p-2 rounded-lg"><FiPlus /></button>
                            </form>
                        </div>

                        {/* Add Course Form */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4">Add New Course</h3>
                            <form onSubmit={handleAddCourse} className="space-y-4">
                                <FormInput id="courseCode" label="Course Code" value={courseCode} onChange={e=>setCourseCode(e.target.value)} required />
                                <FormInput id="courseTitle" label="Course Title (Optional)" value={courseTitle} onChange={e=>setCourseTitle(e.target.value)} />
                                <FormInput id="units" label="Units" type="number" value={units} onChange={e=>setUnits(e.target.value)} required />
                                <FormInput id="gradeRaw" label="Grade (e.g. A, B, 4.5)" value={gradeRaw} onChange={e=>setGradeRaw(e.target.value)} required />
                                <FormButton isLoading={loading}>Add Course</FormButton>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Courses and Results */}
                    <div className="lg:col-span-2 space-y-8">
                         {/* Course Table */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4">{selectedSemester?.name || 'Select a Semester'} Courses</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Code</th>
                                            <th className="p-2">Title</th>
                                            <th className="p-2">Units</th>
                                            <th className="p-2">Grade</th>
                                            <th className="p-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedSemester?.courses.map(c => (
                                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 font-medium">{c.course_code}</td>
                                                <td className="p-2 text-gray-600">{c.course_title}</td>
                                                <td className="p-2">{c.units}</td>
                                                <td className="p-2">{c.grade_raw}</td>
                                                <td className="p-2"><button className="text-red-500"><FiTrash2 /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {selectedSemester?.courses.length === 0 && <p className="text-center py-4 text-gray-500">No courses added yet.</p>}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                                <h4 className="text-lg font-semibold text-gray-600">Semester GPA</h4>
                                <p className="text-4xl font-bold text-brand-blue mt-2">
                                    {(chartData.find(d => d.name === selectedSemester?.name)?.gpa) || '0.00'}
                                </p>
                            </div>
                             <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                                <h4 className="text-lg font-semibold text-gray-600">Cumulative GPA</h4>
                                <p className="text-4xl font-bold text-green-600 mt-2">
                                    {cumulativeGpa?.cumulativeGpa.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4">GPA Progression</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="gpa" stroke="#0D6EFD" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                 {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            </main>
        </DashboardLayout>
    );
};

export default CgpaPage;
