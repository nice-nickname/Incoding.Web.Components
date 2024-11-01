namespace Incoding.Web.Components.Demo
{
    #region << Using >>

    using Incoding.Core;
    using Incoding.Core.Block.Caching;
    using Incoding.Core.Block.Caching.Providers;
    using Incoding.Core.Block.IoC;
    using Incoding.Core.Block.IoC.Provider;
    using Incoding.Web.Components.Demo.Controllers;
    using Microsoft.Extensions.Caching.Memory;
    using NUglify.Css;
    using NUglify.JavaScript;

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

            builder.Services.AddWebOptimizer(pipeline =>
                                             {
                                                 pipeline.MinifyJsFiles(new CodeSettings());
                                                 pipeline.MinifyCssFiles(new CssSettings());

                                                 pipeline.AddJavaScriptBundle("js/_libs.js", "lib/jquery.min.js", "lib/underscore-min.js", "lib/*.js");
                                                 pipeline.AddJavaScriptBundle("js/_scripts.js", "js/**/*.js");
                                                 pipeline.AddCssBundle("css/_styles.css", "css/**/*.css");
                                                 pipeline.AddCssBundle("css/planifi.css", "lib/**/*.css");
                                             },
                                             options =>
                                             {
                                                 options.EnableTagHelperBundling = false;
                                             });

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
            app.UseWebOptimizer();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapHub<SignalHub>("/signals");

            IoCFactory.Instance.Initialize(ioc => ioc.WithProvider(new MSDependencyInjectionIoCProvider(app.Services)));

            CachingFactory.Instance.Initialize(init => init.WithProvider(new NetCachedProvider(() => app.Services.GetRequiredService<IMemoryCache>())));

            app.Run();
        }
    }
}
