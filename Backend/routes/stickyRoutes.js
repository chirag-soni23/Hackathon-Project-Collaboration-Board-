import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../controllers/stickyNoteController.js";

const router = express.Router();

router.post("/create", createNote);
router.get("/", getAllNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
