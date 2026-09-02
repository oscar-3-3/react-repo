"use client";

import { useState, useEffect } from "react";

const API_KEY = "sk-test-1234567890abcdef";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    setNoteCount(notes.length);
  }, [notes]);

  function addNote() {
    console.log("adding note", text, API_KEY);
    notes.push({ id: Math.random(), text });
    setNotes(notes);
    setText("");
  }

  function deleteNote(index) {
    notes.splice(index, 1);
    setNotes(notes);
  }

  return (
    <div style={{ padding: "20px", color: "#333333" }}>
      <h1>My Notes ({noteCount})</h1>
      <img src="/next.svg" />

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addNote}>Add Note</button>

      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <span dangerouslySetInnerHTML={{ __html: note.text }} />
            <button onClick={() => deleteNote(index)}>Delete me</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
