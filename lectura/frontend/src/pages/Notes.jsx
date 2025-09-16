import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import noteService from '../services/noteService';
import { FiSearch } from 'react-icons/fi';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const q = searchParams.get('q') || '';
    const visibility = searchParams.get('visibility') || 'public';

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await noteService.getNotes({ page, q, visibility });
            setNotes(data.notes);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch notes. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [page, q, visibility]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.elements.search.value;
        setSearchParams({ q: searchTerm, page: 1, visibility });
    };

    return (
        <DashboardLayout>
            <Header title="My Notes" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={q}
                                placeholder="Search by title, course code, or tags..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            />
                        </div>
                        <select
                            value={visibility}
                            onChange={(e) => setSearchParams({ q, page: 1, visibility: e.target.value })}
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="all">All My Notes</option>
                        </select>
                        <button type="submit" className="w-full md:w-auto bg-brand-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors">
                            Search
                        </button>
                    </form>
                </div>

                {/* Notes Grid */}
                {loading && <div className="text-center">Loading notes...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map(note => <NoteCard key={note.id} note={note} />)}
                        </div>
                        {notes.length === 0 && <p className="text-center text-gray-500 mt-8">No notes found.</p>}
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                     <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => setSearchParams({ q, visibility, page: page - 1 })}
                            disabled={page <= 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">Page {page} of {totalPages}</span>
                         <button
                            onClick={() => setSearchParams({ q, visibility, page: page + 1 })}
                            disabled={page >= totalPages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </DashboardLayout>
    );
};

export default NotesPage;
