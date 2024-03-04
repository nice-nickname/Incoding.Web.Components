namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridBuilder<T> where T : IRowData
    {
        public Grid<T> Grid { get; }

        private readonly IHtmlHelper _html;

        public GridBuilder(IHtmlHelper html, string id)
        {
            this._html = html;
            this.Grid = new Grid<T>(id);
        }

        public GridBuilder<T> Css(string css)
        {
            this.Grid.Css = css;

            return this;
        }

        public GridBuilder<T> InfiniteScrolling(int chunkSize)
        {
            this.Grid.InfiniteScroll.Enabled = true;
            this.Grid.InfiniteScroll.ChunkSize = chunkSize;

            return this;
        }

        public GridBuilder<T> WebsocketLoader(Action<Grid<T>.WebsocketLoadingOptions> buildOptions)
        {
            buildOptions(this.Grid.Websocket);

            this.Grid.Websocket.Enabled = true;

            return this;
        }

        public GridBuilder<T> UI(Action<Grid<T>.UIOptions> buildOptions)
        {
            buildOptions(this.Grid.UI);

            return this;
        }

        public GridBuilder<T> Split(Action<TableSplitBuilder<T>> buildAction)
        {
            var splitter = new TableSplitBuilder<T>(this._html);

            buildAction(splitter);

            this.Grid.Tables.AddRange(splitter.Tables);

            return this;
        }

        public GridBuilder<T> Bind(ImlBinding binding)
        {
            this.Grid.Binds = binding;

            return this;
        }

        public IHtmlContent Render(bool useConcurrentRender = false)
        {
            return new GridComponentRenderer<T>(this._html, this.Grid, useConcurrentRender).Render();
        }
    }
}
