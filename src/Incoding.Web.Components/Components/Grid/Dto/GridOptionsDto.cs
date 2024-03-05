using Microsoft.AspNetCore.Builder;

namespace Incoding.Web.Components.Grid
{
    public record GridOptionsDto
    {
        public InfiniteScrollOptions Scroll { get; set; }

        public WebsocketLoadingOptions Websocket { get; set; }

        public UIOptions UI { get; set; }
    }
}
