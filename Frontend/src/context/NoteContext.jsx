import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StickyNoteContext = createContext();

export const StickyNoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [noteLoading, setNoteLoading] = useState(true);

  async function fetchNotes() {
    try {
      const { data } = await axios.get("/api/notes");
      setNotes(data);
      setNoteLoading(false);
    } catch (error) {
      toast.error("Failed to load notes");
      setNoteLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function createNote(noteData) {
    try {
      const { data } = await axios.post("/api/notes", noteData);
      setNotes((prev) => [data.note, ...prev]);
    } catch (error) {
      toast.error("Failed to create note");
    }
  }

  async function updateNote(id, updatedData) {
    try {
      const { data } = await axios.put(`/api/notes/${id}`, updatedData);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? data.note : note))
      );
    } catch (error) {
      toast.error("Failed to update note");
    }
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      toast.error("Failed to delete note");
    }
  }

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
