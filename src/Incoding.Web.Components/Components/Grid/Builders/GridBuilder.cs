namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using Incoding.Core.Extensions;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridBuilder<T>
    {
        private readonly Grid<T> _grid;

        private readonly IHtmlHelper _html;

        public GridBuilder(IHtmlHelper html, string id)
        {
            this._html = html;
            _grid = new Grid<T>(id);
        }

        public GridBuilder<T> Css(string css)
        {
            this._grid.Css = css;

            return this;
        }

        public GridBuilder<T> Columns(Action<ColumnListBuilder<T>> buildAction)
        {
            var clb = new ColumnListBuilder<T>();
            buildAction(clb);

            this._grid.Columns = clb.Columns;
            this._grid.Cells = clb.Cells;
            this._grid.CellRenderers = clb.CellRenderers;

            return this;
        }

        public GridBuilder<T> Rows(Action<RowBuilder<T>> buildAction)
        {
            var rb = new RowBuilder<T>();
            buildAction(rb);

            this._grid.Row = rb.Row;

            return this;
        }

        public GridBuilder<T> Binding(Func<IIncodingMetaLanguageEventBuilderDsl, IIncodingMetaLanguageEventBuilderDsl> bindings)
        {
            this._grid.Binding = bindings;

            return this;
        }

        public IHtmlContent Render()
        {
            return new GridRenderer<T>(this._html, this._grid).Render();
        }
    }
}
