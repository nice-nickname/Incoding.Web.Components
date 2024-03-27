namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Dynamic;
    using Incoding.Web.Extensions;
    using JetBrains.Annotations;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridBuilder<T>
    {
        public Grid<T> Grid { get; }

        private readonly IHtmlHelper _html;

        public GridBuilder(IHtmlHelper html, string id)
        {
            this._html = html;
            this.Grid = new Grid<T>(id);
        }

        public GridBuilder<T> Width(string width)
        {
            this.Grid.Width = width;

            return this;
        }

        public GridBuilder<T> Height(string height)
        {
            this.Grid.Height = height;

            return this;
        }

        public GridBuilder<T> Css(string css)
        {
            this.Grid.Css = css;

            return this;
        }

        public GridBuilder<T> Attr(string attr, string value)
        {
            this.Grid.Attr[attr] = value;

            return this;
        }

        public GridBuilder<T> Attr(object attrs)
        {
            foreach (var (key, value) in AnonymousHelper.ToDictionary(attrs))
            {
                this.Attr(key, value.ToString());
            }

            return this;
        }

        public GridBuilder<T> InfiniteScrolling(int chunkSize)
        {
            this.Grid.InfiniteScroll.Enabled = true;
            this.Grid.InfiniteScroll.ChunkSize = chunkSize;

            return this;
        }

        public GridBuilder<T> WebsocketLoader(Action<WebsocketLoadingOptions> buildOptions)
        {
            buildOptions(this.Grid.Websocket);

            this.Grid.Websocket.Enabled = true;

            return this;
        }

        public GridBuilder<T> UI(Action<UIOptions> buildOptions)
        {
            buildOptions(this.Grid.UI);

            return this;
        }

        public GridBuilder<T> Split(Action<TableSplitBuilder<T>> buildAction)
        {
            var splitter = new TableSplitBuilder<T>(this._html);

            buildAction(splitter);

            this.Grid.Tables.AddRange(splitter.Tables);
            this.Grid.Splits.AddRange(splitter.Splits);

            return this;
        }

        public GridBuilder<T> Table(Action<TableBuilder<T>> buildAction)
        {
            return Split(splits =>
            {
                splits.Add(this.Grid.Id + "-table", buildAction);
            });
        }

        public GridBuilder<T> Bind(ImlBinding binding)
        {
            this.Grid.Binds = binding;

            return this;
        }

        public GridBuilder<T> Empty(IHtmlContent content)
        {
            this.Grid.EmptyContent = content;

            return this;
        }

        public GridBuilder<T> Empty(Func<dynamic, IHtmlContent> content)
        {
            this.Grid.EmptyContent = content(null);

            return this;
        }

        public IHtmlContent Render(bool concurrentRender = false)
        {
            return new GridComponentRenderer<T>(this._html, this.Grid).Render(concurrentRender);
        }
    }
}
