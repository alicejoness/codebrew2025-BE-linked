import { useState, useEffect } from 'react';
import MainContent from './MainContent';
import axios from 'axios';
import Sidebar from './Sidebar';
import uuid from  "react-uuid";
import './App.css';
import './Sidebar.css';
import './MainContent.css';

function App() {
  

    // The below states/functions are created in this "higher-order" component (that contains the other components) as they 
    // contain information needed concurrently in BOTH "child" components (Sidebar and MainComponent)

    //Create state to save notes, and set it to be an empty array by default. Note that `setNotes` is state-setter 
    const [notes, setNotes] = useState([]);

    //An effect is used to keep your component synchronised with an external system (see useEffect in react documentation). 
    // In this case we are using to keep our notes array above to be synchronised to the db.
    useEffect(() => {
        //Fetch from our API - you can try go to this URL when the API is running and see what is there!
        fetch('https://localhost:7057/api/Notes')

        //Throw an error if we get a bad result, else convert to JSON.
        .then((res) => {
            console.log(res);
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })

        //Add the notes we returned to our note array. 
        .then((data) => {
            setNotes(data);
        })
        //Throw error in case of bad fetch.
        .catch((err) => {
            console.error("Error fetching Notes:", err);
        });
    }, []);

    // State to store the currently edited note. Default value is `false`.
    const [activeNote, setActiveNote] = useState(false);

    
    // NOTE: All of the below functions are defined in the main `App` component as they 
    // rely on the `notes` state and `setNotes`, which we have chosen not passed into child 
    // components for abstraction's sake.
    

    // This is a function to add a new note, defined using arrow notation.
    const onAddNote = () => {

        console.log("Added new note");

        //Everything below defines the default information of a newly created note
        //Update previous FE id generation system with one that is a length 24 hexadecimal (as required by the API).
        let id_str = uuid().replaceAll("-", "");
        const newNote = {
            id: id_str.substring(0,24),

            title: "Untitled Note",

            content: " ",
            
            //This is also updated from previous FE date system to be the type required by the API.
            createdAt: new Date(Date.now()).toISOString()
        };

        //Now we can post the information to our API.
        axios.post(`https://localhost:7057/api/Notes`, newNote)
            .then(() => {
            //Also update our notes array:
                //Set the `notes` state to be a new array containing `newNote`, plus all the 
                //elements of the previous `notes` state. Note the usage of the `spread` operator.
                setNotes([newNote, ...notes]);
            })
            .catch(error => console.error('Error adding note:', error));

        }

    // This function deletes a specified note, and is defined using "conventional" notation more resembling of python.
    function onDeleteNote(idToDelete) {

        console.log("Deleted note");

        //Call delete on our API
        axios.delete(`https://localhost:7057/api/Notes/${idToDelete}`)
        .then(() => {
            // Explaination: For each `note` in `notes`, filter OUT (eliminate) items for which the given 
            // condition (i.e. `note.id` == `idToDelete`) is TRUE. The remaining items will be made 
            // into the new `notes` state. 
            setNotes(notes.filter((note) => note.id !== idToDelete));
        })
        .catch(error => console.error('Error deleting note:', error));

    }

    const onUpdateNote = (updatedNote) => {

        //Update our createdAt date to match the format required by our API
        updatedNote.createdAt = new Date(updatedNote.createdAt).toISOString();

        //Now call update on our API
        axios.put(`https://localhost:7057/api/Notes/${updatedNote.id}`, updatedNote)
            .then(() => {
            //And also update our local notes array:
                // Create an entirely new array to replace the `notes` state, by looping through each element of `notes`, and 
                // replacing the currently active note with the new (updated) note passed into the function. 
                //
                // All non-active notes are just copied over to the new array, before it is set as the new `notes` state.
                const updatedNotesArray = notes.map((note) => {
                    if (note.id === activeNote) {
                        return updatedNote
                    } else {
                        return note;
                    }
                });

                // Make the new notes array the `notes` array
                setNotes(updatedNotesArray);

            })
            .catch(error => console.error('Error adding note:', error));

    }
    

    // This function returns the note object that is currently listed as `active` in the `activeNote` state.
    const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
    }

    return (
    <>
    <title>CISSA NotesApp 2025 :)</title>

    <div className='App'>

    {/*Here we are passing a variety of states, state-setters and functions as props, so that other components can access them*/}
    <Sidebar notes={notes} onAddNote={onAddNote} onDeleteNote={onDeleteNote} activeNote={activeNote} setActiveNote={setActiveNote}/>
    
    {/*NOTE that here we WANT the `getActiveNote` function to be called (and it's result passed into MainContent) every time it renders. 
    Therefore, we do NOT need to append an empty function call `() =>` to the beginning.*/}
    <MainContent activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>
    </div>
    </>
    );

}

export default App
