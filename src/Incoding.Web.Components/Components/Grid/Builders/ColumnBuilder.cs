namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ColumnBuilder<T>
{
    public ITemplateSyntax<T> Template { get; set; }

    public IHtmlHelper Html { get; }

    public Column Column { get; }

    public ColumnBuilder(IHtmlHelper html)
    {
        Html = html;

        Column = new Column();
    }

    public ColumnBuilder(IHtmlHelper html, int index)
            : this(html)
    {
        Column.Index = index;
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
        Column.Attr[attr] = string.Empty;

        return this;
    }

    public ColumnBuilder<T> Attr(string attr, string value)
    {
        Column.Attr[attr] = value;

        return this;
    }

    public ColumnBuilder<T> Attr(string attr, TemplateContent<T> value)
    {
        Column.Attr[attr] = value(Template).HtmlContentToString();

        return this;
    }

    public ColumnBuilder<T> IsAttr(Expression<Func<T, object>> isField, string attr)
    {
        Column.Attr[Template.IsInline(isField, attr).HtmlContentToString()] = attr;

        return this;
    }

    public ColumnBuilder<T> NotAttr(Expression<Func<T, object>> notField, string attr)
    {
        Column.Attr[Template.IsInline(notField, attr).HtmlContentToString()] = attr;

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

    public ColumnBuilder<T> Field(string field)
    {
        Column.Field = field;

        if (string.IsNullOrWhiteSpace(Column.Title))
            Column.Title = field;

        return Attr("title", tmpl => tmpl.For(field))
               .Sortable()
               .Filterable();
    }

    public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
    {
        var fieldName = fieldAccessor.GetMemberName();
        var colType = ExpressionHelper.GetColumnTypeFromField(fieldAccessor);
        var colFormat = colType.ToColumnFormat();

        Column.Field = fieldName;

        if (string.IsNullOrWhiteSpace(Column.Title))
            Title(fieldName);

        return Attr("title", tmpl => tmpl.For(fieldName))
               .Type(colType)
               .Format(colFormat)
               .Sortable()
               .Filterable();
    }

    public ColumnBuilder<T> Type(ColumnType type)
    {
        Column.Type = type;

        return this;
    }

    public ColumnBuilder<T> Format(ColumnFormat format)
    {
        Column.Format = format;

        return this;
    }

    public ColumnBuilder<T> Align(ColumnAlignment alignment)
    {
        Column.Alignment = alignment;

        return this;
    }

    public ColumnBuilder<T> Content(IHtmlContent content)
    {
        Column.Content = content.HtmlContentToString();

        return this;
    }

    public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
    {
        Column.Content = contentLambda(Template).HtmlContentToString().Trim();

        return this;
    }

    public ColumnBuilder<T> Bind(ImlBinding binding)
    {
        Column.Executable = ImlBinder.ToExecutable(Html, binding);

        return this;
    }

    public ColumnBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        Column.Executable = ImlBinder.ToExecutable(Html, Template, binding);

        return this;
    }

    public ColumnBuilder<T> Hidden()
    {
        Column.Hidden = true;

        foreach (var stacked in Column.Stacked)
            stacked.Hidden = true;

        return this;
    }
}
