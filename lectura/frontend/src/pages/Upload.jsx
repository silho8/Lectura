import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import noteService from '../services/noteService';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const UploadPage = () => {
    const [title, setTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [tags, setTags] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select at least one file to upload.');
            return;
        }
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('course_code', courseCode);
        formData.append('course_name', courseName);
        formData.append('visibility', visibility);
        formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const data = await noteService.createNote(formData);
            navigate(`/notes/${data.note.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload note.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Header title="Upload New Note" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput id="title" label="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <FormInput id="courseCode" label="Course Code" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput id="courseName" label="Course Name (Optional)" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                            <div>
                                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <FormInput id="tags" label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. calculus, exam, chapter1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Files</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                                            <span>Upload files</span>
                                            <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOCX up to 20MB</p>
                                </div>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h4>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                            <span className="text-sm text-gray-800 truncate">{file.name}</span>
                                            <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                                                <FiX />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div className="text-right">
                            <FormButton isLoading={loading} type="submit" fullWidth={false}>
                                Upload Note
                            </FormButton>
                        </div>
                    </form>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default UploadPage;
