
// Note the capitalisation! This is an import of a COMPONENT, which will help us render markdown!
import ReactMarkdown from "react-markdown";


function MainContent({activeNote, onUpdateNote}) {

    function onEditField(textFieldKey, editedValue) {
        // We need to pass through a NEW note with the edited info, but SAME id as the current 
        // version of the note, so it acts as a replacement
        onUpdateNote({
            // This spreads out the elements (id, title, body, lastModified) of the 
            // active note.
            ...activeNote,

            // As the below lines are executed after the above, this section will overwrites the relevant field 
            // (either title or content) with editedValue, and update the lastModified field with the current time
            [textFieldKey]: editedValue,
            createdAt: Date.now(),
        });
    };

    // We NEED to accound for the case where there is no current activeNote, otherwise 
    // the rendering will fail below when we try to access the activeNote attributes.
    if(!activeNote) {
        return ( 
            <div className="no-active-note"> 
                <h6>No note selected. Create or select one to get started.</h6>
            </div>
        )}

    return (
        <div className="app-main">
            <div className = "app-main-note-edit">
                <input type="text" id="title" placeholder="Title here..." value = {activeNote.title} onChange={(e) => onEditField("title", e.target.value)} autoFocus />
                <textarea id="body" placeholder="Write your note here..." value = {activeNote.content} onChange={(e) => onEditField("content", e.target.value)}/>
            </div>

            {/* Whatever the current activeNote is, preview it's stored information*/}
            <div className="app-main-note-preview">
                
                <h1 className="preview-title"> 
                    {activeNote.title}
                </h1>
                <div className="markdown-preview">
                    <ReactMarkdown >
                        {activeNote.content}
                    </ReactMarkdown>
                </div>
            </div>    
        </div>
    );
  }
  
  export default MainContent;