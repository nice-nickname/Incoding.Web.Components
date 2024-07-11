namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
using Incoding.Web.Extensions;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ColumnBuilder<T>
{
    public IHtmlHelper Html { get; }

    public Cell<T> Cell { get; }

    public Column Column { get; }

    public ColumnBuilder(IHtmlHelper html)
    {
        this.Cell = new Cell<T>();
        this.Column = new Column();

        this.Cell.Column = this.Column;
        this.Column.Cell = this.Cell;
        this.Html = html;
    }

    public ColumnBuilder(IHtmlHelper html, int index)
            : this(html)
    {
        this.Column.Index = index;

        this.HeaderAttr("data-index", index.ToString())
            .Attr("data-index", index.ToString())
            .FooterAttr("data-index", index.ToString());
    }

    public ColumnBuilder<T> Css(string css)
    {
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

    public ColumnBuilder<T> Attr(string attr)
    {
        return Attr(attr, _ => string.Empty.ToHtmlString());
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

    public ColumnBuilder<T> IsAttr(Expression<Func<T, object>> isField, string attr)
    {
        this.Cell.TemplateAttrs.Add(tmpl => tmpl.IsInline(isField, attr));

        return this;
    }

    public ColumnBuilder<T> NotAttr(Expression<Func<T, object>> isField, string attr)
    {
        this.Cell.TemplateAttrs.Add(tmpl => tmpl.NotInline(isField, attr));
        return this;
    }

    public ColumnBuilder<T> Totalable(bool value = true)
    {
        this.Column.Totalable = value;

        return this;
    }

    public ColumnBuilder<T> Filterable(bool value = true)
    {
        this.Column.Filterable = value;

        return this;
    }

    public ColumnBuilder<T> Sortable(bool value = true)
    {
        this.Column.Sortable = value;

        return this;
    }

    public ColumnBuilder<T> SortedBy(SortOrder sort)
    {
        this.Column.SortedBy = sort;

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
            this.Column.Title = field;

        if (this.Cell.Content == null)
            Content(tmpl => tmpl.For(field));

        return this.Attr("data-value", tmpl => tmpl.For(field))
                   .Attr("title", tmpl => tmpl.For(field))
                   .Sortable()
                   .Filterable();
    }

    public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
    {
        var fieldName = fieldAccessor.GetMemberName();
        var colType = ExpressionHelper.GetColumnTypeFromField(fieldAccessor);
        var colFormat = colType.ToColumnFormat();

        this.Cell.Field = fieldName;

        if (string.IsNullOrWhiteSpace(this.Column.Title))
            Title(fieldName);

        if (this.Cell.Content == null)
            Content(tmpl => tmpl.For(fieldAccessor).ToString().ToMvcHtmlString());

        return this.Attr("data-value", tmpl => tmpl.For(fieldName))
                   .Attr("title", tmpl => tmpl.For(fieldName))
                   .Type(colType)
                   .Format(colFormat)
                   .Sortable()
                   .Filterable();
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

    public ColumnBuilder<T> Align(ColumnAlignment alignment)
    {
        this.Cell.Alignment = alignment;

        return this;
    }

    public ColumnBuilder<T> Content(IHtmlContent content)
    {
        return this.Content(_ => content);
    }

    public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
    {
        this.Cell.Content = contentLambda;

        return this;
    }

    public ColumnBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        this.Cell.Binding = binding;

        return this;
    }

    public ColumnBuilder<T> Map(ColumnAttribute columnAttribute)
    {
        this.Width(columnAttribute.Width);
        this.Format(columnAttribute.Format);
        this.Field(columnAttribute.Field);
        this.Sortable().Filterable();

        if (string.IsNullOrWhiteSpace(this.Column.Title))
            this.Title(columnAttribute.Title);

        if (columnAttribute.Type == ColumnType.Numeric)
            this.Totalable();

        return this;
    }
}
