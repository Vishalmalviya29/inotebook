const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");

// this end-point will fetch all the notes of the logged in user.
// ROUTE 1: get all the notes using: GET "/api/notes/fetchallnotes". login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add new note using: POST "/api/notes/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "description must be atleast three characters"
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there are errors then return errors and bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: update an existing note using: PUT "/api/notes/updatenote". login required
// only the logged in user can update the note, that's why we need id
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }

    // allow only only if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    // find the note id and update it.
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: delete an existing note using: DELETE "/api/notes/deletenote". login required
// only the logged in user can update the note, that's why we need id
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }

    // allow only only if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    // find the note id and delete it.
    note = await Note.findByIdAndDelete(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ success: "note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
