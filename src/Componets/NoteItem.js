import React from "react";
import noteContext from "../context/notes/NoteContext.js";
import { useContext } from "react";

export default function NoteItem(props) {
  const context = useContext(noteContext);
  const { delNote } = context;
  const { note, updateNote } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">
            {note.description}
          </p>
          <i className="far fa-trash-alt" onClick={() => {delNote(note._id)}}></i>
          <i className="far fa-edit mx-2" onClick={() => {updateNote(note)}}></i>
        </div>
      </div>
    </div>
  );
}
