import mongoose from "mongoose";

const stickyNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
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
