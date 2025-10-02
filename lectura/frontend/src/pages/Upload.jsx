import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import noteService from '../services/noteService';
import { useAuth } from '../context/AuthContext';
import { FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

// A custom-styled select component to match our theme
const FormSelect = ({ id, label, value, onChange, children }) => (
  <div className="w-full">
    <label htmlFor={id} className="block font-pixel text-lg text-primary mb-2 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full appearance-none px-4 py-3 bg-base-200 text-text-light font-sans
                   border-2 border-base-300
                   focus:outline-none focus:border-primary"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
        <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

const Upload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !courseCode) {
            toast.error('Title and Course Code are required.');
            return;
        }
        setLoading(true);
        const toastId = toast.loading('Uploading note...');

        try {
            const noteData = {
                title,
                description,
                course_code: courseCode,
                visibility,
                user_id: user.id,
            };

            const newNote = await noteService.createNote(noteData, file);
            toast.success('Note uploaded successfully!', { id: toastId });
            navigate(`/notes/${newNote.id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to upload note.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-12">
                <h1 className="text-5xl font-pixel text-accent mb-2">
                    Upload Transmission
                </h1>
                <p className="text-text-light text-lg">
                    Share new data with the collective. Fill out the fields below.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-base-200 p-8 border-2 border-base-300 shadow-pixel-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Chapter 5 Summary" />
                        <FormInput id="courseCode" label="Course Code" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required placeholder="e.g., CS101" />
                    </div>

                    <FormInput id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of the note's content..." />

                    <div>
                        <label className="block font-pixel text-lg text-primary mb-2 uppercase tracking-wide">File Attachment</label>
                        <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-base-300 border-dashed hover:border-primary transition-colors">
                            <div className="space-y-1 text-center">
                                <FaUpload className="mx-auto h-12 w-12 text-base-300" />
                                <div className="flex text-sm text-text-light">
                                    <label htmlFor="file-upload" className="relative cursor-pointer font-pixel text-primary hover:text-accent focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </div>
                                {file ? (
                                    <p className="text-accent font-pixel">{file.name}</p>
                                ) : (
                                    <p className="text-xs text-base-300">PNG, JPG, PDF, DOCX up to 10MB</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <FormSelect id="visibility" label="Visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="public">Public (Visible to everyone)</option>
                        <option value="private">Private (Visible only to you)</option>
                    </FormSelect>

                    <div className="text-right pt-4">
                        <FormButton isLoading={loading} type="submit" fullWidth={false}>
                            Transmit Note
                        </FormButton>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Upload;