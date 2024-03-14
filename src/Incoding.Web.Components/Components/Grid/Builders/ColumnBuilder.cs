namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;
    using Microsoft.AspNetCore.Html;

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
            this.Column.Cell = this.Cell;
        }

        public ColumnBuilder(int index) : this()
        {
            this.Column.Index = index;

            this.HeaderAttr("data-index", index.ToString())
                .Attr("data-index", index.ToString())
                .FooterAttr("data-index", index.ToString());
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

        public ColumnBuilder<T> Totalable(bool value = true)
        {
            this.Column.Totalable = value;

            return this;
        }

        public ColumnBuilder<T> HeaderAttr(string attr, string value)
        {
            this.Column.Attr[attr] = value;

            return this;
        }

        public ColumnBuilder<T> FooterAttr(string attr, string value)
        {
            this.Column.FooterAttr[attr] = value;

            return this;
        }

        public ColumnBuilder<T> Field(string field)
        {
            this.Cell.Field = field;

            if (string.IsNullOrWhiteSpace(this.Column.Title))
            {
                this.Column.Title = field;
            }

            if (this.Cell.Content == null)
            {
                Content(tmpl => tmpl.For(field));
            }

            return this.Attr("data-value", tmpl => tmpl.For(field))
                       .Attr("data-title", tmpl => tmpl.For(field));
        }

        public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
        {
            var fieldName = ExpressionHelper.GetFieldName(fieldAccessor);
            var colType = ExpressionHelper.GetColumnTypeFromField(fieldAccessor);
            var colFormat = colType.ToColumnFormat();

            this.Cell.Field = fieldName;

            if (string.IsNullOrWhiteSpace(this.Column.Title))
            {
                Title(fieldName);
            }

            if (this.Cell.Content == null)
            {
                ContentTemplate(tmpl => tmpl.For(fieldAccessor).ToString().ToMvcHtmlString(), false);
            }

            return this.Attr("data-value", tmpl => tmpl.For(fieldName))
                       .Attr("data-title", tmpl => tmpl.For(fieldName))
                       .Type(colType)
                       .Format(colFormat);

        }

        public ColumnBuilder<T> Type(ColumnType type)
        {
            this.Cell.Type = type;

            return this.Attr("data-type", this.Cell.Type.ToString());
        }

        public ColumnBuilder<T> Format(ColumnFormat format)
        {
            this.Cell.Format = format;

            return this.Attr("data-format", this.Cell.Format.ToString());
        }

        public ColumnBuilder<T> Content(IHtmlContent content)
        {
            return this.ContentTemplate(_ => content, true);
        }

        public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
        {
            return ContentTemplate(contentLambda, true);
        }

        private ColumnBuilder<T> ContentTemplate(TemplateContent<T> contentLambda, bool hasCustomContent)
        {
            this.Cell.Content = contentLambda;
            this.Cell.HasCustomContent = hasCustomContent;

            return this.Attr("data-custom-template", hasCustomContent.ToString());
        }

        public ColumnBuilder<T> Bind(ImlTemplateBinding<T> binding)
        {
            this.Cell.Binding = binding;

            return this;
        }
    }
}
