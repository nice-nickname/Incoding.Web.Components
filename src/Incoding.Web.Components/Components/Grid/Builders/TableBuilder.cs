namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class TableBuilder<T>
    {
        public Table<T> Table;

        private readonly IHtmlHelper _html;

        public TableBuilder(IHtmlHelper html, string id)
        {
            this._html = html;
            Table = new Table<T>(id);
        }

        public TableBuilder<T> Css(string css)
        {
            this.Table.Css += " " + css;

            return this;
        }

        public TableBuilder<T> Columns(Action<ColumnListBuilder<T>> buildAction)
        {
            var clb = new ColumnListBuilder<T>();
            buildAction(clb);

            this.Table.Columns = clb.Columns;
            this.Table.Cells = clb.Cells;
            this.Table.CellRenderers = clb.CellRenderers;

            return this;
        }

        public TableBuilder<T> Rows(Action<RowBuilder<T>> buildAction)
        {
            var rb = new RowBuilder<T>();
            buildAction(rb);

            this.Table.Row = rb.Row;

            return this;
        }

        public TableBuilder<T> Binding(ImlBinding bindings)
        {
            this.Table.Binding = bindings;

            return this;
        }

        public TableBuilder<T> Nested<U>(Expression<Func<T, IEnumerable<U>>> nestedField, Action<TableBuilder<U>> buildAction)
        {
            var nestedGrid = new TableBuilder<U>(this._html, "");

            buildAction(nestedGrid);

            this.Table.NestedTable = new TableRenderer<U>(this._html, nestedGrid.Table).RenderComponent();

            return this;
        }
    }
}
