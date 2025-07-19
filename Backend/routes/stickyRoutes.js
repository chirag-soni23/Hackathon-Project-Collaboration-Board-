import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../controllers/stickyNoteController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/create", isAuth, createNote);
router.get("/", isAuth, getAllNotes);
router.put("/:id", isAuth, updateNote);
router.delete("/:id", isAuth, deleteNote);

export default router;
