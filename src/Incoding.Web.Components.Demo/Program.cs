namespace Incoding.Web.Components.Demo
{
    #region << Using >>

    using Incoding.Core;
    using Incoding.Core.Block.IoC;
    using Incoding.Core.Block.IoC.Provider;
    using Incoding.Web.Components.Demo.Controllers;

    #endregion

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddHostedService<WarmUpHostedService>();

            builder.Services
                   .AddControllersWithViews()
                   .AddRazorRuntimeCompilation();

            builder.Services.AddSignalR()
                            .AddJsonProtocol(options =>
                                {
                                    options.PayloadSerializerOptions.PropertyNameCaseInsensitive = false;
                                    options.PayloadSerializerOptions.PropertyNamingPolicy = null;
                                });

            builder.Services.ConfigureIncodingWebServices();
            builder.Services.ConfigureIncodingCoreServices();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapHub<SignalHub>("/signals");

            IoCFactory.Instance.Initialize(ioc => ioc.WithProvider(new MSDependencyInjectionIoCProvider(app.Services)));

            app.Run();
        }
    }
}
