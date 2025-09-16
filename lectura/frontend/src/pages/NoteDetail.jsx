import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import noteService from '../services/noteService';
import { FiDownload, FiFileText, FiImage, FiShare2, FiArrowLeft } from 'react-icons/fi';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            setLoading(true);
            try {
                const data = await noteService.getNoteById(id);
                setNote(data.note);
                // Set the first file as the default preview
                if (data.note.files && data.note.files.length > 0) {
                    setPreviewFile(data.note.files[0]);
                }
            } catch (err) {
                setError('Failed to fetch note details.');
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const getFileIcon = (mimetype) => {
        if (mimetype.startsWith('image/')) return <FiImage className="text-blue-500" />;
        if (mimetype === 'application/pdf') return <FiFileText className="text-red-500" />;
        return <FiFileText className="text-gray-500" />;
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    if (!note) return <div className="flex h-screen items-center justify-center">Note not found.</div>;

    return (
        <DashboardLayout>
            <Header title="Note Details" />
            <main className="flex-1 overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="mb-6">
                    <Link to="/notes" className="flex items-center text-brand-blue hover:underline mb-4">
                        <FiArrowLeft className="mr-2" />
                        Back to all notes
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
                    <p className="text-lg text-brand-blue font-semibold mt-1">{note.course_code}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left side - Preview */}
                    <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-2">
                        {previewFile ? (
                            previewFile.mimetype.startsWith('image/') ? (
                                <img
                                    src={noteService.getFilePreviewUrl(previewFile.id)}
                                    alt="File preview"
                                    className="w-full h-full max-h-[70vh] object-contain rounded"
                                />
                            ) : previewFile.mimetype === 'application/pdf' ? (
                                <iframe
                                    src={noteService.getFilePreviewUrl(previewFile.id)}
                                    title="PDF Preview"
                                    className="w-full h-[70vh] border-0 rounded"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
                                    <FiFileText size={64} />
                                    <p className="mt-4">Preview not available for this file type.</p>
                                    <p>Click "Download" to view the file.</p>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center justify-center h-[70vh] text-gray-500">No files to preview.</div>
                        )}
                    </div>

                    {/* Right side - Files and Details */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                             <h3 className="text-xl font-bold mb-4 border-b pb-2">Files ({note.files.length})</h3>
                             <ul className="space-y-3">
                                {note.files.map(file => (
                                    <li key={file.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <span className="mr-3">{getFileIcon(file.mimetype)}</span>
                                            <button onClick={() => setPreviewFile(file)} className="text-left hover:underline">
                                                <p className="font-medium text-gray-800">{file.filename_original}</p>
                                                <p className="text-xs text-gray-500">{(file.filesize_bytes / 1024 / 1024).toFixed(2)} MB</p>
                                            </button>
                                        </div>
                                        <button onClick={() => noteService.downloadFile(file.id)} className="p-2 text-gray-600 hover:text-brand-blue">
                                            <FiDownload size={20} />
                                        </button>
                                    </li>
                                ))}
                             </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-bold mb-4 border-b pb-2">Details</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>Uploader:</strong> {note.uploader.full_name}</p>
                                <p><strong>Visibility:</strong> <span className="capitalize">{note.visibility}</span></p>
                                <p><strong>Uploaded:</strong> {new Date(note.created_at).toLocaleString()}</p>
                                {note.course_name && <p><strong>Course Name:</strong> {note.course_name}</p>}
                                {note.tags && note.tags.length > 0 && <p><strong>Tags:</strong> {note.tags.join(', ')}</p>}
                            </div>
                            <button className="w-full mt-6 flex items-center justify-center bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                <FiShare2 className="mr-2" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default NoteDetailPage;
