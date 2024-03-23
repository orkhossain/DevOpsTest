using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

    public async Task<List<User>> GetUsers()
    {
        return await _users.Find(user => true).ToListAsync();
    }

    public async Task<User> GetUser(string id)
    {
        return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
    }

    public async Task<User> CreateUser(User user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task UpdateUser(string id, User user)
    {
        await _users.ReplaceOneAsync(u => u.Id == id, user);
    }

    public async Task DeleteUser(string id)
    {
        await _users.DeleteOneAsync(user => user.Id == id);
    }
}
