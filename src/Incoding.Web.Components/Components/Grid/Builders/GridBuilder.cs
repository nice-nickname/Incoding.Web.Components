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
        private readonly IHtmlHelper _html;

        private readonly Grid<T> _grid;

        public GridBuilder(IHtmlHelper html, string id)
        {
            this._html = html;
            this._grid = new Grid<T>(id);
        }

        public GridBuilder<T> Split(Action<TableSplitBuilder<T>> buildAction)
        {
            var splitter = new TableSplitBuilder<T>(this._html);

            buildAction(splitter);

            this._grid.Tables.AddRange(splitter.Tables);

            return this;
        }

        public GridBuilder<T> Bind(ImlBinding binding)
        {
            this._grid.Binds = binding;

            return this;
        }

        public IHtmlContent Render(bool useConcurrentRender = false)
        {
            return new GridComponentRenderer<T>(this._html, this._grid, useConcurrentRender).Render();
        }
    }
}
