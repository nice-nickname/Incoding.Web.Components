namespace Incoding.Web.Components.Demo
{
    #region << Using >>

    using Incoding.Core;
    using Incoding.Core.Block.IoC;
    using Incoding.Core.Block.IoC.Provider;

    #endregion

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services
                   .AddControllersWithViews()
                   .AddRazorRuntimeCompilation();

            builder.Services.ConfigureIncodingWebServices();
            builder.Services.ConfigureIncodingCoreServices();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");


            IoCFactory.Instance.Initialize(ioc => ioc.WithProvider(new MSDependencyInjectionIoCProvider(app.Services)));

            app.Run();
        }
    }
}
