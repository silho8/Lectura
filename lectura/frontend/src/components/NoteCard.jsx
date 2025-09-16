import React from 'react';
import { FiDownload, FiEye, FiUser, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const fileCount = note.files?.length || 0;
  const firstFile = note.files?.[0];

  const getFileTypeLabel = (mimetype) => {
    if (mimetype.startsWith('image/')) return `${fileCount} Image(s)`;
    if (mimetype === 'application/pdf') return `${fileCount} PDF(s)`;
    if (mimetype.includes('word')) return `${fileCount} DOCX`;
    return `${fileCount} File(s)`;
  };

  return (
    <Link to={`/notes/${note.id}`} className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 truncate">{note.title}</h3>
        {firstFile && (
            <span className="text-xs font-semibold text-white bg-brand-blue px-2 py-1 rounded-full">
                {getFileTypeLabel(firstFile.mimetype)}
            </span>
        )}
      </div>
      <p className="text-brand-blue font-semibold mb-3">{note.course_code}</p>

      <div className="text-sm text-gray-500 space-y-2">
        <div className="flex items-center">
            <FiUser className="mr-2" />
            <span>Shared by {note.uploader?.full_name || 'Unknown'}</span>
        </div>
        <div className="flex items-center">
            <FiEye className="mr-2" />
            <span className="capitalize">{note.visibility}</span>
        </div>
        {note.tags && note.tags.length > 0 && (
            <div className="flex items-center flex-wrap pt-2">
                <FiTag className="mr-2" />
                {note.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-1 mb-1">{tag}</span>
                ))}
            </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">
            {new Date(note.created_at).toLocaleDateString()}
        </p>
        <button
            onClick={(e) => { e.preventDefault(); alert('Download clicked!'); }}
            className="flex items-center text-sm font-medium text-brand-blue hover:underline"
        >
            <FiDownload className="mr-1" />
            Download All
        </button>
      </div>
    </Link>
  );
};

export default NoteCard;
