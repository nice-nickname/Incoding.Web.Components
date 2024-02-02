namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Collections.Concurrent;
    using System.Net;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Routing;

    #endregion

    public static class ApplicationBuilderExtension
    {
        public static readonly string RouteName = "/templates";

        public static IEndpointConventionBuilder MapGridTemplatesRoute(this IEndpointRouteBuilder router)
        {
            return router.MapGet(RouteName + "/{templateId}",
                                 (HttpContext context, string templateId) =>
                                 {
                                     if (string.IsNullOrWhiteSpace(templateId) || !GridTemplatesStore.Global.HasKey(templateId))
                                     {
                                         context.Response.StatusCode = 401;
                                         return context.Response.WriteAsync("not found");
                                     }

                                     return context.Response.WriteAsJsonAsync(new IncodingResult.JsonData(true, GridTemplatesStore.Global.Get(templateId), null, HttpStatusCode.OK));
                                 });
        }

        public static string GridTemplate(this IUrlHelper url, string id)
        {
            return RouteName + $"/{id}";
        }
    }

    public class GridTemplatesStore
    {
        private static GridTemplatesStore _globalInstance;

        private readonly ConcurrentDictionary<string, string> _store;

        private GridTemplatesStore()
        {
            _store = new ConcurrentDictionary<string, string>();
        }

        public static GridTemplatesStore Global
        {
            get
            {
                if (_globalInstance == null)
                {
                    _globalInstance = new GridTemplatesStore();
                }

                return _globalInstance;
            }
        }

        public void Set(string key, string template)
        {
            _store[key] = template;
        }

        public bool HasKey(string key)
        {
            return this._store.ContainsKey(key);
        }

        public string Get(string key)
        {
            return _store[key];
        }
    }
}
