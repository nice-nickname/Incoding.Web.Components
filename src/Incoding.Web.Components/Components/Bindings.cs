namespace Incoding.Web.Components;

public static class Bindings
{
    public static class Grid
    {
        public static readonly string Init = "grid-init";

        public static class Websocket
        {
            public static readonly string Start = "websocket-start";

            public static readonly string Complete = "websocket-complete";

            public static readonly string Error = "websocket-error";
        }
    }

    public static class Table
    {
        public static readonly string Init = "table-init";

        public static readonly string Rendered = "table-rows-rendered";
    }

    public static readonly string LazyLoad = "lazy";
}
