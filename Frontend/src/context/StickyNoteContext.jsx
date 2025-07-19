import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StickyNoteContext = createContext();

export const StickyNoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [noteLoading, setNoteLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("/api/notes");
      setNotes(data);
    } catch (error) {
      toast.error("Failed to fetch notes");
    } finally {
      setNoteLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create new note
  const createNote = async ({ text, x, y, color }) => {
    try {
      const { data } = await axios.post("/api/notes/create", {
        text,
        x,
        y,
        color,
      });
      setNotes((prev) => [...prev, data]);
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  // Update note
  const updateNote = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`/api/notes/${id}`, updatedData);
      setNotes((prev) => prev.map((note) => (note._id === id ? data : note)));
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <StickyNoteContext.Provider
      value={{
        notes,
        noteLoading,
        createNote,
        updateNote,
        deleteNote,
        fetchNotes,
      }}
    >
      {children}
    </StickyNoteContext.Provider>
  );
};

export const useStickyNotes = () => useContext(StickyNoteContext);
