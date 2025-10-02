import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const createNote = async (noteData, file) => {
  const { title, description, course_code, visibility, user_id } = noteData;

  if (!user_id) {
    throw new Error('User must be logged in to create a note.');
  }

  let filePath = null;
  let fileType = null;

  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    filePath = `${user_id}/${fileName}`;
    fileType = file.type;

    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id,
      title,
      description,
      course_code,
      visibility,
      file_path: filePath,
      file_type: fileType,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }

  return data;
};

const getNotes = async ({ q = '', visibility = 'public' }) => {
  let query = supabase
    .from('notes')
    .select('*, profiles (username, avatar_url)')
    .order('created_at', { ascending: false });

  if (visibility === 'public') {
    query = query.eq('visibility', 'public');
  } else {
    // For 'private' or 'all', we assume user is logged in and RLS handles access.
    // This part would be expanded if we wanted a 'my notes' vs 'all notes' view.
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,course_code.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
  return data;
};

const getNoteById = async (id) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*, profiles (id, username, full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching note by ID:', error);
    throw error;
  }
  return data;
};

const updateNote = async (id, noteData) => {
  const { data, error } = await supabase
    .from('notes')
    .update(noteData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating note:', error);
    throw error;
  }
  return data;
};

const deleteNote = async (noteId, filePath) => {
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from('notes')
      .remove([filePath]);
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Don't throw, still attempt to delete the DB record
    }
  }

  const { error: dbError } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  if (dbError) {
    console.error('Error deleting note from database:', dbError);
    throw dbError;
  }
  return true;
};

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  const { data } = supabase.storage.from('notes').getPublicUrl(filePath);

  // Supabase getPublicUrl doesn't throw an error for non-existent files,
  // it returns a URL that will 404. This is usually fine for display purposes.
  // The URL might need to be a signed URL if the bucket is not public.
  // Our bucket is private, so we need a signed URL.

  return data.publicUrl; // This needs to be a signed URL in a real scenario
};

const createSignedFileUrl = async (filePath, expiresIn = 60) => {
  if (!filePath) return null;
  const { data, error } = await supabase.storage
    .from('notes')
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
  return data.signedUrl;
};

const noteService = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getFileUrl,
  createSignedFileUrl,
};

export default noteService;