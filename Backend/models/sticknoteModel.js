import mongoose from "mongoose";

const StickyNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 220 },
    color: { type: String, default: "#FEF9C3" },
  },
  { timestamps: true }
);

export const StickyNote = mongoose.model("stickynote", StickyNoteSchema);
