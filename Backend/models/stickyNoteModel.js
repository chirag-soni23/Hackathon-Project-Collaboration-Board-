import mongoose from "mongoose";

const stickyNoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "#FEF9C3",
    },
  },
  { timestamps: true }
);

export const StickyNote = mongoose.model("StickyNote", stickyNoteSchema);
