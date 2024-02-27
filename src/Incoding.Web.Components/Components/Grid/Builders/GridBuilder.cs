namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
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

        public GridBuilder<T> Css(string css)
        {
            this.Grid.Css = css;

            return this;
        }

        public GridBuilder<T> Virtualize(Action<Grid<T>.VirtualizationOptions> buildOptions)
        {
            buildOptions(this.Grid.Virtualization);

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
