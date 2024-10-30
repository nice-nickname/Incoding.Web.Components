namespace Incoding.Web.Components;

public static class Bindings
{
    public static class Grid
    {
        public static class SignalR
        {
            public const string Start = "splitGrid.signalr.start";

            public const string Complete = "splitGrid.signalr.complete";

            public const string Error = "splitGrid.signalr.error";
        }

        internal const string DataSourceInit = "dataSourceInit";

        public const string ColumnUpdate = "splitGrid.columnUpdate";
    }
}
