using Microsoft.AspNetCore.Mvc;
using NotesAPI.Models;
using NotesAPI.Services;

namespace NotesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly NoteService _noteService;

        public NotesController(NoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Note>>> Get() =>
            await _noteService.GetAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> Get(string id)
        {
            var note = await _noteService.GetAsync(id);
            if (note is null) return NotFound();
            return note;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Note note)
        {
            await _noteService.CreateAsync(note);
            return CreatedAtAction(nameof(Get), new { id = note.Id }, note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Note note)
        {
            var existing = await _noteService.GetAsync(id);
            if (existing is null) return NotFound();
            note.Id = id;
            await _noteService.UpdateAsync(id, note);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _noteService.GetAsync(id);
            if (existing is null) return NotFound();
            await _noteService.DeleteAsync(id);
            return NoContent();
        }
    }
}
