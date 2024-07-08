namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
using Incoding.Web.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableBuilder<T>
{
    public Table<T> Table { get; }

    public IHtmlHelper Html { get; }

    public GridStyles.Stylings DefaultStyles { get; }

    public TableBuilder(IHtmlHelper html, string id, GridStyles.Stylings styles)
    {
        this.Html = html;
        this.Table = new Table<T>(id);
        this.DefaultStyles = styles;
    }

    public TableBuilder<T> Css(string css)
    {
        this.Table.Css += " " + css;

        return this;
    }

    public TableBuilder<T> Attr(string attr, string value)
    {
        this.Table.Attr[attr] = value;

        return this;
    }

    public TableBuilder<T> Attr(object attrs)
    {
        foreach (var (key, value) in AnonymousHelper.ToDictionary(attrs))
        {
            this.Attr(key, value.ToString());
        }

        return this;
    }

    public TableBuilder<T> Layout(LayoutType layout)
    {
        this.Table.Layout = layout;

        return this;
    }

    public TableBuilder<T> Columns(Action<ColumnListBuilder<T>> columns)
    {
        var clb = new ColumnListBuilder<T>(this.Html);
        columns(clb);

        this.Table.Columns = clb.Columns;
        this.Table.Cells = clb.Cells;
        this.Table.CellRenderers = clb.CellRenderers;

        return this;
    }

    public TableBuilder<T> Rows(Action<RowBuilder<T>> rows)
    {
        var rb = new RowBuilder<T>(this.Html);
        rows(rb);

        this.Table.Row = rb.Row;

        return this;
    }

    public TableBuilder<T> Bind(ImlBinding bindings)
    {
        this.Table.Binding = bindings;

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContent<T> dropdownContent)
    {
        this.Table.Row.DropdownContent = dropdownContent;

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContentAsync<T> dropdownContentAsync)
    {
        this.Table.Row.DropdownContent = tmpl =>
                                         {
                                             var awaitable = dropdownContentAsync(tmpl).ConfigureAwait(false);

                                             return awaitable.GetAwaiter().GetResult();
                                         };

        return this;
    }

    public TableBuilder<T> Nested<TNested>(Expression<Func<T, IEnumerable<TNested>>> nestedField, Action<TableBuilder<TNested>> nestedTable)
    {
        var tableBuilder = new TableBuilder<TNested>(this.Html, this.Table.Id + "-nested", this.DefaultStyles);
        tableBuilder.Table.InheritStyles(this.Table);

        nestedTable(tableBuilder);

        var fieldName = nestedField.GetMemberName();
        this.Table.NestedField = fieldName;
        this.Table.NestedTable = new TableRenderer<TNested>(this.Html, tableBuilder.Table, this.DefaultStyles).RenderComponent();

        return this;
    }
}
