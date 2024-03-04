namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Grid<T> where T : IRowData
    {
        public string Id { get; }

        public string Css { get; set; }

        public List<Table<T>> Tables { get; set; } = new();

        public InfiniteScrollOptions InfiniteScroll { get; set; } = new();

        public WebsocketLoadingOptions Websocket { get; set; } = new();

        public UIOptions UI { get; set; } = new();

        public ImlBinding Binds { get; set; } = dsl => dsl.When("_").OnSuccess(dsl => dsl.Self());

        public Grid(string id)
        {
            Id = id;
        }

        public class InfiniteScrollOptions
        {
            public bool Enabled { get; set; }

            public int ChunkSize { get; set; }

            public int PlaceholderRows { get; set; } = 3;
        }

        public class WebsocketLoadingOptions
        {
            public bool Enabled { get; set; }

            public int ChunkSize { get; set; } = 40;

            public string Method { get; set; }
        }

        public class UIOptions
        {
            public bool HighlightRowsOnHover { get; set; }

            public bool CascadeEvents { get; set; }
        }
    }
}
