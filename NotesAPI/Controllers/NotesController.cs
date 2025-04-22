using Microsoft.AspNetCore.Mvc;
using NotesAPI.Models;
using NotesAPI.Services;

namespace NotesAPI.Controllers
{
    // Marks this class as a Web API controller
    [ApiController]
    
    // Sets the route to: api/Notes
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        // Service that handles MongoDB operations
        private readonly NoteService _noteService;

        // Constructor to inject NoteService via dependency injection
        public NotesController(NoteService noteService)
        {
            _noteService = noteService;
        }

        // GET: api/Notes
        // Returns a list of all notes
        [HttpGet]
        public async Task<ActionResult<List<Note>>> Get() =>
            await _noteService.GetAsync();

        // GET: api/Notes/{id}
        // Returns a single note by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> Get(string id)
        {
            var note = await _noteService.GetAsync(id);
            if (note is null) return NotFound(); // 404 if not found
            return note; // 200 OK with the note data
        }

        // POST: api/Notes
        // Adds a new note to the database
        [HttpPost]
        public async Task<IActionResult> Post(Note note)
        {
            await _noteService.CreateAsync(note);
            // Returns 201 Created with location header
            return CreatedAtAction(nameof(Get), new { id = note.Id }, note);
        }

        // PUT: api/Notes/{id}
        // Updates an existing note
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Note note)
        {
            var existing = await _noteService.GetAsync(id);
            if (existing is null) return NotFound(); // 404 if note doesn't exist

            note.Id = id; // Ensure the correct ID is being updated
            await _noteService.UpdateAsync(id, note);
            return NoContent(); // 204 No Content to indicate success
        }

        // DELETE: api/Notes/{id}
        // Deletes a note by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _noteService.GetAsync(id);
            if (existing is null) return NotFound(); // 404 if not found

            await _noteService.DeleteAsync(id);
            return NoContent(); // 204 No Content to indicate success
        }
    }
}
