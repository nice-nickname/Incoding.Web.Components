namespace Incoding.Web.Components
{
    public static class Bindings
    {
        public static class Grid
        {
            public static readonly string Init = "grid-init";

            public static class InfiniteScroll
            {
                public static readonly string Start = "websocket-start";

                public static readonly string LoadChunk = "websocket-load-chunk";

                public static readonly string RenderChunk = "websocket-render-chunk";

                public static readonly string Complete = "websocket-complete";
            }
        }

        public static class Table
        {
            public static readonly string Init = "table-init";
        }
    }
}
