namespace Incoding.Web.Components;

public static class Bindings
{
    public static class Grid
    {
        public static readonly string Init = "grid-init";

        public static class SignalR
        {
            public static readonly string Start = "websocket-start";

            public static readonly string Complete = "websocket-complete";

            public static readonly string Error = "websocket-error";
        }
    }
}
