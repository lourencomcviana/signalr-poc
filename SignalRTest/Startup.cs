using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SignalRTest.Hubs;

namespace SignalRTest
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder
                        .WithOrigins("http://localhost:4200")
                        .AllowCredentials()
                        .AllowAnyMethod()
                        .AllowAnyHeader()

                    // .AllowAnyOrigin()
                );
            });
            
            // services.AddCors(options =>
            //     options.AddDefaultPolicy(builder => builder
            //         .AllowAnyOrigin()
            //         .AllowAnyMethod()
            //         .AllowAnyHeader())
            //     );
            
            services.AddSignalR();
            services.AddControllers();
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            
            app.UseCors("CorsPolicy");
            
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chatHub");
                endpoints.MapHub<ChartHub>("/chart");
                endpoints.MapControllers();
            });
        }
    }
}