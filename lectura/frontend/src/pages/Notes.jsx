import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import NoteCard from '../components/NoteCard';
import noteService from '../services/noteService';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(q);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // We're fetching all public notes for now. The service can be updated
            // to fetch user-specific notes later if needed.
            const data = await noteService.getNotes({ q, visibility: 'public' });
            setNotes(data);
        } catch (err) {
            setError('Failed to fetch notes. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [q]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm });
    };

    return (
        <DashboardLayout>
            <div className="mb-12">
                <h1 className="text-5xl font-pixel text-accent mb-2">
                    Note Archive
                </h1>
                <p className="text-text-light text-lg">
                    Browse the collective knowledge. Use the search to find what you need.
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-base-200 p-6 border-2 border-base-300 shadow-pixel-sm mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:flex-grow">
                         <FormInput
                            id="search"
                            label=""
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title, course, etc..."
                        />
                    </div>
                    <div className="w-full md:w-auto pt-5">
                        <FormButton type="submit" isLoading={loading} fullWidth={true}>
                            Find
                        </FormButton>
                    </div>
                </form>
            </div>

            {/* Notes Grid */}
            {loading && (
                <div className="text-center font-pixel text-2xl text-accent animate-pulse">
                    Loading Notes...
                </div>
            )}
            {error && (
                <div className="text-center font-pixel text-2xl text-error">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {notes.map(note => <NoteCard key={note.id} note={note} />)}
                        </div>
                    ) : (
                        <p className="text-center font-pixel text-2xl text-text-light mt-8">
                            No notes found. Why not upload the first one?
                        </p>
                    )}
                </>
            )}
        </DashboardLayout>
    );
};

export default Notes;