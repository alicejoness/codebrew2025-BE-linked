using NotesAPI.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace NotesAPI.Services
{
    public class NoteService
    {
        // Reference to the Notes collection in MongoDB
        private readonly IMongoCollection<Note> _notesCollection;

        // Set up MongoDB connection using appsettings config
        public NoteService(IConfiguration config)
        {
            var client = new MongoClient(config["NotesDatabaseSettings:ConnectionString"]);
            var database = client.GetDatabase(config["NotesDatabaseSettings:DatabaseName"]);
            _notesCollection = database.GetCollection<Note>(config["NotesDatabaseSettings:NotesCollectionName"]);
        }

        // Get all notes
        public async Task<List<Note>> GetAsync() =>
            await _notesCollection.Find(_ => true).ToListAsync();

        // Get note by ID
        public async Task<Note> GetAsync(string id) =>
            await _notesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Create a new note
        public async Task CreateAsync(Note note) =>
            await _notesCollection.InsertOneAsync(note);

        // Update a note by ID
        public async Task UpdateAsync(string id, Note note) =>
            await _notesCollection.ReplaceOneAsync(x => x.Id == id, note);

        // Delete a note by ID
        public async Task DeleteAsync(string id) =>
            await _notesCollection.DeleteOneAsync(x => x.Id == id);
    }
}
