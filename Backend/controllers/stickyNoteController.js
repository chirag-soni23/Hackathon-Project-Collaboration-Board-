import { StickyNote } from "../models/sticknoteModel.js";
import { TryCatch } from "../utils/TryCatch.js";

export const createNote = TryCatch(async (req, res) => {
  const {
    text = "",
    x,
    y,
    width = 200,
    height = 220,
    color = "#FEF9C3",
  } = req.body;

  if (x === undefined || y === undefined) {
    return res.status(400).json({ message: "Position (x, y) is required" });
  }

  const note = await StickyNote.create({
    user: req.user._id,
    text,
    x,
    y,
    width,
    height,
    color,
  });

  res.status(201).json({ message: "Note created", note });
});

export const getMyNotes = TryCatch(async (req, res) => {
  const notes = await StickyNote.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });
  res.json(notes);
});

export const updateNote = TryCatch(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const note = await StickyNote.findOneAndUpdate(
    { _id: id, user: req.user._id },
    updates,
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ message: "Note updated", note });
});

export const deleteNote = TryCatch(async (req, res) => {
  const { id } = req.params;

  const note = await StickyNote.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ message: "Note deleted" });
});
