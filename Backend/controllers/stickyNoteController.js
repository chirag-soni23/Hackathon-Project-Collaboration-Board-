import { StickyNote } from "../models/stickyNoteModel.js";

// Create a new sticky note
export const createNote = async (req, res) => {
  try {
    const { text, x, y, color } = req.body;
    const note = await StickyNote.create({ text, x, y, color });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error });
  }
};

// Get all sticky notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await StickyNote.find().sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
};

// Update a note (text, position, color)
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, x, y, color } = req.body;
    const updated = await StickyNote.findByIdAndUpdate(
      id,
      { text, x, y, color },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error });
  }
};

// Delete a sticky note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await StickyNote.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error });
  }
};
