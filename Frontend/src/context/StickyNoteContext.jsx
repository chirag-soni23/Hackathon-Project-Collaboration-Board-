import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../socket"; // import socket

const StickyNoteContext = createContext();

export const StickyNoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [noteLoading, setNoteLoading] = useState(true);

  // Fetch initial notes
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("/api/notes");
      setNotes(data);
    } catch {
      toast.error("Failed to fetch notes");
    } finally {
      setNoteLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    socket.on("noteCreated", (note) => {
      setNotes((prev) => [...prev, note]);
    });

    socket.on("noteUpdated", (updatedNote) => {
      setNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
    });

    socket.on("noteDeleted", (id) => {
      setNotes((prev) => prev.filter((note) => note._id !== id));
    });

    return () => {
      socket.off("noteCreated");
      socket.off("noteUpdated");
      socket.off("noteDeleted");
    };
  }, []);

  const createNote = async ({ text, x, y, color }) => {
    try {
      const { data } = await axios.post("/api/notes/create", { text, x, y, color });
      setNotes((prev) => [...prev, data]);
      socket.emit("createNote", data);
    } catch {
      toast.error("Failed to create note");
    }
  };

  const updateNote = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`/api/notes/${id}`, updatedData);
      setNotes((prev) => prev.map((note) => (note._id === id ? data : note)));
      socket.emit("updateNote", data);
    } catch {
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      socket.emit("deleteNote", id);
    } catch {
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
