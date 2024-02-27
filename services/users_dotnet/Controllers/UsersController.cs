using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    private readonly UserRepository _userRepository;

    public ValuesController(IMongoDatabase database)
    {
        _userRepository = new UserRepository(database);
    }

    // GET: api/values
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> Get()
    {
        return await _userRepository.GetUsers();
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> Get(string id)
    {
        var user = await _userRepository.GetUser(id);
        if (user == null)
            return NotFound();

        return user;
    }

    // POST api/values
    [HttpPost]
    public async Task<ActionResult<User>> Post([FromBody] User user)
    {
        await _userRepository.CreateUser(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] User user)
    {
        var existingUser = await _userRepository.GetUser(id);
        if (existingUser == null)
            return NotFound();

        user.Id = existingUser.Id;
        await _userRepository.UpdateUser(id, user);
        return NoContent();
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userRepository.GetUser(id);
        if (user == null)
            return NotFound();

        await _userRepository.DeleteUser(id);
        return NoContent();
    }
}
