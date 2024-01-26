namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class ColumnBuilder<T>
    {
        private readonly Grid<T> _grid;

        private readonly List<Column<T>> _columns;

        private Column<T> _column;

        private bool? totalable;

        private bool? sortable;

        private bool? filterable;

        public IHtmlHelper Html { get; }

        public ColumnBuilder(IHtmlHelper html, Grid<T> grid)
        {
            this.Html = html;

            this._grid = grid;
            this._columns = new List<Column<T>>();
            this._column = new Column<T>();
        }

        #region Basic properties

        public ColumnBuilder<T> Type(ColumnType type)
        {
            this._column.Type = type;
            return this;
        }

        public ColumnBuilder<T> Css(string css)
        {
            this._column.CssClass = css;
            return this;
        }

        public ColumnBuilder<T> Title(string title)
        {
            this._column.Title = title;
            return this;
        }

        public ColumnBuilder<T> Attr(string attribute, object value)
        {
            return Attr(attribute, tmpl => value.ToString().ToMvcHtmlString());
        }

        public ColumnBuilder<T> Attr(string attribute, TemplateContent<T> value)
        {
            if (this._column.Attributes.ContainsKey(attribute))
            {
                this._column.Attributes[attribute] = value;
            }
            else
            {
                this._column.Attributes.Add(attribute, value);
            }

            return this;
        }

        public ColumnBuilder<T> Filterable(bool value = true)
        {
            this.filterable = !this._column.IsTemplateColumn && value;
            return this;
        }

        public ColumnBuilder<T> Totalable(bool value = true)
        {
            this.totalable = this._column.IsNumericColumn && value;
            return this;
        }

        public ColumnBuilder<T> Sortable(bool value = true)
        {
            this.sortable = !this._column.IsTemplateColumn && value;
            return this;
        }

        #endregion

        #region Content

        public ColumnBuilder<T> Prop(Expression<Func<T, object>> fieldExpr, ColumnType type = ColumnType.Plain)
        {
            var fieldName = PropertyHelper.PropertyNameFromExpr(fieldExpr);
            if (string.IsNullOrWhiteSpace(this._column.Title))
            {
                this._column.Title = fieldName;
            }

            this._column.Content = tmpl => new HtmlString(tmpl.For(fieldExpr));
            this._column.Value = tmpl => new HtmlString(tmpl.For(fieldExpr));

            this._column.Type = type;

            return this;
        }

        public ColumnBuilder<T> Value(TemplateContent<T> tmpl, ColumnType type = ColumnType.Plain)
        {
            this._column.Value = tmpl;
            this._column.Type = type;

            return this;
        }

        public ColumnBuilder<T> Template(TemplateContent<T> tmpl)
        {
            this._column.Content = tmpl;
            return this;
        }

        #endregion

        public void Add()
        {
            if (!this.totalable.HasValue)
                Totalable(this._grid.Totalable);

            if (!this.sortable.HasValue)
                Sortable(this._grid.Sortable);

            if (!this.filterable.HasValue)
                Filterable(this._grid.Filterable);

            this._column.Sortable = this.sortable.GetValueOrDefault();
            this._column.Filterable = this.filterable.GetValueOrDefault();
            this._column.Totalable = this.totalable.GetValueOrDefault();

            this._columns.Add(this._column);
            this._column = new Column<T>(this._column.Index + 1);

            this.totalable = null;
            this.sortable = null;
            this.filterable = null;
        }

        public Column<T> Column => this._column;

        public List<Column<T>> Columns => this._columns;
    }
}
