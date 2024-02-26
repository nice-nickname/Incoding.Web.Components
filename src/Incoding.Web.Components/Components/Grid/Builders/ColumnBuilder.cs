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

        public ColumnBuilder<T> Css(string css)
        {
            this.Column.Css = css;

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

            return this;
        }

        public ColumnBuilder<T> Format(ColumnFormat format)
        {
            this.Cell.Format = format;

            return this;
        }

        public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
        {
            this.Cell.Content = contentLambda;

            return this;
        }
    }
}
