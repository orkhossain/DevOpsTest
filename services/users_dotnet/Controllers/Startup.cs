using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using MongoDB.Driver;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<MongoDBSettings>(Configuration.GetSection("MongoDBSettings"));
        services.AddSingleton<IMongoClient>(serviceProvider =>
            new MongoClient(Configuration.GetValue<string>("MongoDBSettings:ConnectionString")));
        services.AddScoped<IMongoDatabase>(serviceProvider =>
            serviceProvider.GetRequiredService<IMongoClient>().GetDatabase(Configuration.GetValue<string>("MongoDBSettings:DatabaseName")));
        services.AddTransient<UserRepository>();
        services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Configure the app
    }
}
