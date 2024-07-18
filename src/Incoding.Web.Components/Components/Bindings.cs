namespace Incoding.Web.Components;

public static class Bindings
{
    public static class Grid
    {
        public const string Init = "grid-init";

        public static class SignalR
        {
            public const string Start = "websocket-start";

            public const string Complete = "websocket-complete";

            public const string Error = "websocket-error";
        }

        internal const string DataSourceInit = "grid-data-source-init";

        public const string ColumnResize = "grid-column-resize";
    }
}
