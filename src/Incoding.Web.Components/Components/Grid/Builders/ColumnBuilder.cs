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
        Cell = new Cell<T>();
        Column = new Column();

        Cell.Column = Column;
        Column.Cell = Cell;
        Html = html;
    }

    public ColumnBuilder(IHtmlHelper html, int index)
            : this(html)
    {
        Column.Index = index;

        HeaderAttr("data-index", index.ToString())
                .Attr("data-index", index.ToString())
                .FooterAttr("data-index", index.ToString());
    }

    public ColumnBuilder<T> Id(int id)
    {
        Column.Id = id;

        return this;
    }

    public ColumnBuilder<T> Css(string css)
    {
        Column.Css += " " + css;

        return this;
    }

    public ColumnBuilder<T> Width(int width)
    {
        Column.Width = width;

        return this;
    }

    public ColumnBuilder<T> Title(string title)
    {
        Column.Title = title;

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
        Cell.Attrs[attr] = value;

        return this;
    }

    public ColumnBuilder<T> IsAttr(Expression<Func<T, object>> isField, string attr)
    {
        Cell.TemplateAttrs.Add(tmpl => tmpl.IsInline(isField, attr));

        return this;
    }

    public ColumnBuilder<T> NotAttr(Expression<Func<T, object>> isField, string attr)
    {
        Cell.TemplateAttrs.Add(tmpl => tmpl.NotInline(isField, attr));
        return this;
    }

    public ColumnBuilder<T> Totalable(bool value = true)
    {
        Column.Totalable = value;

        return this;
    }

    public ColumnBuilder<T> Filterable(bool value = true)
    {
        Column.Filterable = value;

        return this;
    }

    public ColumnBuilder<T> Sortable(bool value = true)
    {
        Column.Sortable = value;

        return this;
    }

    public ColumnBuilder<T> SortedBy(SortOrder sort)
    {
        Column.SortedBy = sort;

        return this;
    }

    public ColumnBuilder<T> Resizable(bool value = true)
    {
        Column.Resizable = value;

        return this;
    }

    public ColumnBuilder<T> HeaderAttr(string attr, string value)
    {
        Column.Attr[attr] = value;

        return this;
    }

    public ColumnBuilder<T> FooterAttr(string attr, string value)
    {
        Column.FooterAttr[attr] = value;

        return this;
    }

    public ColumnBuilder<T> Field(string field)
    {
        Cell.Field = field;

        if (string.IsNullOrWhiteSpace(Column.Title))
            Column.Title = field;

        if (Cell.Content == null)
            Content(tmpl => tmpl.For(field));

        return Attr("data-value", tmpl => tmpl.For(field))
               .Attr("title", tmpl => tmpl.For(field))
               .Sortable()
               .Filterable();
    }

    public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
    {
        var fieldName = fieldAccessor.GetMemberName();
        var colType = ExpressionHelper.GetColumnTypeFromField(fieldAccessor);
        var colFormat = colType.ToColumnFormat();

        Cell.Field = fieldName;

        if (string.IsNullOrWhiteSpace(Column.Title))
            Title(fieldName);

        if (Cell.Content == null)
            Content(tmpl => tmpl.For(fieldAccessor).ToString().ToMvcHtmlString());

        return Attr("data-value", tmpl => tmpl.For(fieldName))
               .Attr("title", tmpl => tmpl.For(fieldName))
               .Type(colType)
               .Format(colFormat)
               .Sortable()
               .Filterable();
    }

    public ColumnBuilder<T> Type(ColumnType type)
    {
        Cell.Type = type;

        return Attr("data-type", Cell.Type.ToString());
    }

    public ColumnBuilder<T> Format(ColumnFormat format)
    {
        Cell.Format = format;

        return Attr("data-format", Cell.Format.ToString());
    }

    public ColumnBuilder<T> Align(ColumnAlignment alignment)
    {
        Cell.Alignment = alignment;

        return this;
    }

    public ColumnBuilder<T> Content(IHtmlContent content)
    {
        return Content(_ => content);
    }

    public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
    {
        Cell.Content = contentLambda;

        return this;
    }

    public ColumnBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        Cell.Binding = binding;

        return this;
    }

    public ColumnBuilder<T> Map(ColumnAttribute columnAttribute)
    {
        Width(columnAttribute.Width == 0 ? 200 : columnAttribute.Width);
        Format(columnAttribute.Format);
        Field(columnAttribute.Field);
        Sortable().Filterable().Resizable();

        if (string.IsNullOrWhiteSpace(Column.Title))
            Title(columnAttribute.Title);

        if (columnAttribute.Type == ColumnType.Numeric)
            Totalable();

        return this;
    }

    public ColumnBuilder<T> Hidden()
    {
        Column.Width = 0;

        foreach (var stacked in Column.Columns)
            stacked.Width = 0;

        return this;
    }
}
