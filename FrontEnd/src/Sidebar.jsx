
function Sidebar({notes, onAddNote, onDeleteNote, activeNote, setActiveNote}) {
  return (
    <div className="app-sidebar">

        <div className="app-sidebar-header">
            <h1>Notes</h1>
            <button onClick={onAddNote}>Add Note</button>
        </div>            

        <div className="app-sidebar-notes">

            {/* The arrow notation below says:
            "For every `note` item in the state `notes`, apply (`map` it to) the following JSX"

            It is very important that you reference `note` below, NOT `notes`. 
            `note` is a single item, pulled from the array found in the `notes` state*/
            }
            {notes.map((note) => (

            // Note the string interpolation using template literals (backticks ``)
            // This line builds the final className string like this:
            // If the current note's ID matches the activeNote ID, it becomes: "app-sidebar-note active"
            // If not, it just becomes: "app-sidebar-note"
            //
            // Explaination:
            // - `${...}` is used to embed JS logic inside a string
            // - The logic: `note.id === activeNote && "active"` means:
            //      "If true, return 'active'; otherwise, return false (which gets ignored in the final string)"
            //      So you're conditionally adding the 'active' class suffix, which registers to a different css style
            //
            // It's a JS shorthand for:
            //    note.id === activeNote ? "active" : ""
                
                <div className={`app-sidebar-note ${note.id === activeNote ? "active" : ""}`} key={note.id}  onClick={() => setActiveNote(note.id)}>

                    <div className="sidebar-note-title">
                        <strong>{note.title}</strong>


                        {/*The empty inline arrow function is neccesary below, in order to call 
                        `onDeleteNote` when the onClick event happens. Without it, `onDeleteNote` would run immediately 
                        whenever the component renders */
                        }

                        <button onClick={() => onDeleteNote(note.id)}>Delete</button>
                    </div>
                
                    {/*Note the use of conditional rendering below to shorten the output of the preview
                    Explaination:
                     - If note.content exists (is TRUE), then display the first 10 characters of it, followed by ....”
                     - Equivalent to: `note.content ? note.content.substring(0, 10) + "..." : "" `
                    */}
                    <p>{note.content && note.content.substring(0,20) + "..."}</p>

                    <small className="note-meta">
                        
                        Last Modified {" "} 
                        
                        {/*Here we format the `lastModified` field into a string*/}
                        {new Date(note.createdAt).toLocaleDateString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </small>
                </div>
            ))}

        </div>
    </div>
  )
}

export default Sidebar;