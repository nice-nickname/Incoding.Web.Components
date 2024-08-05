namespace Incoding.Web.Components;

public static class Bindings
{
    public static class Grid
    {
        public const string Init = "grid-init";

        public static class SignalR
        {
            public const string Start = "signalr-start";

            public const string Complete = "signalr-complete";

            public const string Error = "signalr-error";
        }

        internal const string DataSourceInit = "grid-data-source-init";

        public const string ColumnResize = "grid-column-resize";
    }
}
