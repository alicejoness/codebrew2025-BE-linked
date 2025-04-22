using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NotesAPI.Models
{
    public class Note
    {
        // MongoDB ObjectId used as the unique ID
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // Title of the note
        [BsonElement("title")]
        public string? Title { get; set; }

        // Content/body of the note
        [BsonElement("content")]
        public string? Content { get; set; }

        // Timestamp for when the note was created
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
