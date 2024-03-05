namespace Incoding.Web.Components
{
    public static class Bindings
    {
        public static class Grid
        {
            public static readonly string Init = "grid-init";

            public static class Websocket
            {
                public static readonly string Start = "webscoket-start";

                public static readonly string Cancel = "webscoket-cancel";


                public static readonly string Started = "websocket-started";

                public static readonly string LoadChunk = "websocket-load-chunk";

                public static readonly string Completed = "websocket-completed";
            }
        }

        public static class Table
        {
            public static readonly string Init = "table-init";
        }

        public static readonly string LazyLoad = "lazy";
    }
}
