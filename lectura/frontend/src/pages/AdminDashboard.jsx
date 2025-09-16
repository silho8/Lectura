import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import adminService from '../services/adminService';

const AdminDashboardPage = () => {
    const [view, setView] = useState('users'); // 'users' or 'notes'
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (view === 'users') {
                    const data = await adminService.listUsers();
                    setUsers(data.users);
                } else {
                    const data = await adminService.listAllNotes();
                    setNotes(data.notes);
                }
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [view]);

    const handleBanUser = async (userId) => {
        if(window.confirm('Are you sure you want to change this user\'s status?')) {
            await adminService.banUser(userId);
            const data = await adminService.listUsers(); // Refresh
            setUsers(data.users);
        }
    };

    const handleDeleteNote = async (noteId) => {
         if(window.confirm('Are you sure you want to delete this note permanently?')) {
            await adminService.deleteNoteAsAdmin(noteId);
            const data = await adminService.listAllNotes(); // Refresh
            setNotes(data.notes);
        }
    };

    return (
        <DashboardLayout>
            <Header title="Admin Dashboard" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="border-b border-gray-200 mb-4">
                        <nav className="flex space-x-4">
                            <button onClick={() => setView('users')} className={`py-2 px-4 font-semibold ${view === 'users' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500'}`}>
                                Manage Users
                            </button>
                            <button onClick={() => setView('notes')} className={`py-2 px-4 font-semibold ${view === 'notes' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500'}`}>
                                Manage Notes
                            </button>
                        </nav>
                    </div>

                    {loading && <p>Loading...</p>}

                    {view === 'users' && (
                        <table className="w-full text-left">
                            <thead><tr className="border-b"><th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{user.id}</td>
                                        <td className="p-2">{user.full_name}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                        <td className="p-2"><button onClick={() => handleBanUser(user.id)} className="text-red-600 hover:underline">Toggle Ban</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {view === 'notes' && (
                        <table className="w-full text-left">
                            <thead><tr className="border-b"><th className="p-2">ID</th><th className="p-2">Title</th><th className="p-2">Uploader</th><th className="p-2">Visibility</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {notes.map(note => (
                                    <tr key={note.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{note.id}</td>
                                        <td className="p-2">{note.title}</td>
                                        <td className="p-2">{note.uploader.full_name}</td>
                                        <td className="p-2">{note.visibility}</td>
                                        <td className="p-2"><button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:underline">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
