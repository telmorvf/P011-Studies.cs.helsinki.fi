// hooks
import { useState, useEffect } from 'react'

// services
import noteService from './services/notes'

// components
import Note from './components/Note'
import Footer from './components/Footer'
import Notification from './components/Notification'


const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // conditional rendering: do not render anything if notes is still null
  if (!notes) {
    return null
  }


  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    if (newNote !== '') {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        important: Math.random() > 0.5,
        // id: notes.length + 1,
      }

      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
        })
    }
  }


  const notesToShow = (showAll
    ? notes
    : notes.filter(note => note.important)
  )

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map(note =>
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  )
}

export default App