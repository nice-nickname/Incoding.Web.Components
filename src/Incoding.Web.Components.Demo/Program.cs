namespace Incoding.Web.Components.Demo
{
    #region << Using >>

    using Incoding.Core;

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

            app.Run();
        }
    }
}
