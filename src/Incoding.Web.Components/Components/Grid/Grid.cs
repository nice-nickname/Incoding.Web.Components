namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using Microsoft.AspNetCore.Html;

    #endregion

    public class Grid<T> where T : IRowData
    {
        public string Id { get; }

        public string Css { get; set; }

        public string Width { get; set; }

        public string Height { get; set; }

        public List<Table<T>> Tables { get; set; } = new();

        public List<Splitter> Splits { get; set; } = new();

        public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();

        public IHtmlContent EmptyContent { get; set; }

        public InfiniteScrollOptions InfiniteScroll { get; set; } = new();

        public WebsocketLoadingOptions Websocket { get; set; } = new();

        public UIOptions UI { get; set; } = new();

        public ImlBinding Binds { get; set; } = null;

        public Grid(string id)
        {
            Id = id;
        }
    }
}
