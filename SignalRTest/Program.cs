using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SignalRTest
{
    public class Program
    {
        public static bool isService { get; set; }
        public static void Main(string[] args)
        {
            ILogger<Program> logger = CreateLogger();
            
            isService = !(Debugger.IsAttached || args.Contains("--console"));

            IHostBuilder builder;
            if (isService)
            {
                logger.LogInformation("executando como serviço");
                builder = CreateHostBuilderWindowsService(args);
            }
            else
            {
                logger.LogInformation("executando como aplicação");
                builder = CreateHostBuilder(args);
            }
            builder.Build().Run();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
        
        private static IHostBuilder CreateHostBuilderWindowsService(string[] args) =>
            CreateHostBuilder(args).UseWindowsService();
        
        private static ILogger<Program> CreateLogger() =>
            LoggerFactory
                .Create(logging => logging.AddConsole())
                .CreateLogger<Program>();
        
    }
}