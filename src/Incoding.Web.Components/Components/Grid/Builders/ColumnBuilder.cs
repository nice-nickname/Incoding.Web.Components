namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;

    #endregion

    public class ColumnBuilder<T>
    {
        public Cell<T> Cell { get; }

        public Column Column { get; }

        public ColumnBuilder()
        {
            this.Cell = new Cell<T>();
            this.Column = new Column();

            this.Cell.Column = this.Column;
        }

        public ColumnBuilder(int index) : this()
        {
            this.Column.Index = index;

            this.HeaderAttr("data-index", index.ToString())
                .Attr("data-index", index.ToString());
        }

        public ColumnBuilder<T> Css(string css, bool replace = false)
        {
            if (replace)
            {
                this.Column.Css = string.Empty;
            }

            this.Column.Css += " " + css;

            return this;
        }

        public ColumnBuilder<T> Width(int width)
        {
            this.Column.Width = width;

            return this;
        }

        public ColumnBuilder<T> Title(string title)
        {
            this.Column.Title = title;

            return this;
        }

        public ColumnBuilder<T> Attr(string attr, string value)
        {
            return Attr(attr, _ => value.ToHtmlString());
        }

        public ColumnBuilder<T> Attr(string attr, TemplateContent<T> value)
        {
            this.Cell.Attrs[attr] = value;

            return this;
        }

        public ColumnBuilder<T> HeaderAttr(string attr, string value)
        {
            this.Column.Attr[attr] = value;

            return this;
        }

        public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
        {
            var fieldName = ExpressionHelper.GetFieldName(fieldAccessor);

            this.Cell.Field = fieldName;
            this.Cell.Type = ExpressionHelper.GetColumnTypeFromField(fieldAccessor);
            this.Cell.Format = this.Cell.Type.ToColumnFormat();

            if (string.IsNullOrWhiteSpace(this.Column.Title))
            {
                this.Column.Title = fieldName;
            }

            if (this.Cell.Content == null)
            {
                Content(tmpl => tmpl.For(fieldAccessor).ToString().ToMvcHtmlString());
            }

            return this.Attr("data-value", tmpl => tmpl.For(fieldName))
                       .Attr("data-title", tmpl => tmpl.For(fieldName))
                       .Attr("data-type", this.Cell.Type.ToString())
                       .Attr("data-format", this.Cell.Format.ToString());
        }

        public ColumnBuilder<T> Format(ColumnFormat format)
        {
            this.Cell.Format = format;

            return this.Attr("data-format", this.Cell.Format.ToString());
        }

        public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
        {
            this.Cell.Content = contentLambda;

            return this;
        }
    }
}
