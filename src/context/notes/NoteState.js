import React, { useState } from "react";
import noteContext from "./NoteContext";

export default function NoteState(props) {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);

  // get all notes
  const getNotes = async () => {
    //API call
    let url = `${host}/api/notes/fetchallnotes`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    console.log(json);
    setNotes(json)
  };


  // Add a note
  const addNote = async (title, description, tag) => {
    //API call
    let url = `${host}/api/notes/addnote`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
    });
    const note = await response.json();
    console.log("hi");
    setNotes(notes.concat(note));
  };


  // delete a note
  const delNote = async (id) => {
    //API call
    const url = `${host}/api/notes/deletenote/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = response.json(); // parses JSON response into native JavaScript objects
    console.log(json)

    console.log("deleting note with the id - " + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };


  // edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const url = `${host}/api/notes//updatenote/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
    });
    const json = response.json(); // parses JSON response into native JavaScript objects

    let newNotes = JSON.parse(JSON.stringify(notes));

    // logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <noteContext.Provider value={{ notes, addNote, delNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
}
