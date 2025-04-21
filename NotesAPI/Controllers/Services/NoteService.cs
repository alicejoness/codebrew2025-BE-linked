using NotesAPI.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace NotesAPI.Services
{
    public class NoteService
    {
        private readonly IMongoCollection<Note> _notesCollection;

        public NoteService(IConfiguration config)
        {
            var client = new MongoClient(config["NotesDatabaseSettings:ConnectionString"]);
            var database = client.GetDatabase(config["NotesDatabaseSettings:DatabaseName"]);
            _notesCollection = database.GetCollection<Note>(config["NotesDatabaseSettings:NotesCollectionName"]);
        }

        public async Task<List<Note>> GetAsync() =>
            await _notesCollection.Find(_ => true).ToListAsync();

        public async Task<Note> GetAsync(string id) =>
            await _notesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Note note) =>
            await _notesCollection.InsertOneAsync(note);

        public async Task UpdateAsync(string id, Note note) =>
            await _notesCollection.ReplaceOneAsync(x => x.Id == id, note);

        public async Task DeleteAsync(string id) =>
            await _notesCollection.DeleteOneAsync(x => x.Id == id);
    }
}
