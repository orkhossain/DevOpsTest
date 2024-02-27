using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public int Age { get; set; }
}
