import express from "express";
import {
  createNote,
  getMyNotes,
  updateNote,
  deleteNote,
} from "../controllers/stickyNoteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/", getMyNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
