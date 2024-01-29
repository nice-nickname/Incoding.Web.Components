namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridBuilder<T>
    {
        private readonly Grid<T> _grid;

        private readonly IHtmlHelper _html;

        public Grid<T> __grid__ => this._grid;

        public GridBuilder()
        {
            _grid = new Grid<T>();
        }

        public GridBuilder<T> Css(string css)
        {
            this._grid.Css = css;

            return this;
        }

        public GridBuilder<T> Columns(Action<ColumnListBuilder<T>> buildAction)
        {
            var cb = new ColumnListBuilder<T>();
            buildAction(cb);

            this._grid.Columns = cb.Columns;
            this._grid.Header = cb.Headers;

            return this;
        }

        public GridBuilder<T> Rows(Action<RowBuilder<T>> buildAction)
        {
            var rb = new RowBuilder<T>();
            buildAction(rb);

            this._grid.Row = rb.Row;

            return this;
        }
    }
}
