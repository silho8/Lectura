import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCode, FaFilePdf, FaFileImage, FaFileWord, FaQuestionCircle } from 'react-icons/fa';

const NoteCard = ({ note }) => {
  // Gracefully handle cases where a note might be null or undefined.
  if (!note) {
    return null;
  }

  const getFileTypeIcon = (fileType) => {
    if (!fileType) return <FaQuestionCircle className="mr-2" />;
    if (fileType.startsWith('image/')) return <FaFileImage className="mr-2" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="mr-2" />;
    if (fileType.includes('word')) return <FaFileWord className="mr-2" />;
    return <FaQuestionCircle className="mr-2" />;
  };

  // Safe access to nested properties with fallbacks.
  const username = note.profiles?.username || 'Anonymous';
  const fileTypeDisplay = note.file_type ? note.file_type.split('/')[1].toUpperCase() : 'No File';

  return (
    <Link
      to={`/notes/${note.id}`}
      className="block bg-base-200 p-4 border-2 border-base-300
                 shadow-pixel-sm hover:shadow-pixel-sm-primary
                 transition-all duration-200 ease-out
                 hover:-translate-y-1 group flex flex-col h-full"
    >
      {/* Card Header */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-pixel text-primary group-hover:text-secondary truncate">
            {note.title || 'Untitled Note'}
          </h3>
          <span className="text-xs font-pixel text-accent capitalize bg-base-300 px-2 py-1">
            {note.visibility || 'private'}
          </span>
        </div>

        <div className="flex items-center text-accent mb-4">
          <FaCode className="mr-2" />
          <p className="font-pixel text-lg">{note.course_code || 'General'}</p>
        </div>

        <p className="text-text-light font-sans mb-4 truncate">
          {note.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-base-300 mt-auto">
        <div className="flex items-center text-sm text-primary">
          <FaUser className="mr-2" />
          <span>{username}</span>
        </div>
        <div className="flex items-center text-sm text-primary">
          {getFileTypeIcon(note.file_type)}
          <span>{fileTypeDisplay}</span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;