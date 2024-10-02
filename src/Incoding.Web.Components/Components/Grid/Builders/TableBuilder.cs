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
        Html = html;
        Table = new Table<T>(id);
        DefaultStyles = styles;
    }

    public TableBuilder<T> Css(string css)
    {
        Table.Css += " " + css;

        return this;
    }

    public TableBuilder<T> Attr(string attr, string value)
    {
        Table.Attr[attr] = value;

        return this;
    }

    public TableBuilder<T> Attr(object attrs)
    {
        foreach (var (key, value) in AnonymousHelper.ToDictionary(attrs))
        {
            Attr(key, value.ToString());
        }

        return this;
    }

    public TableBuilder<T> Layout(LayoutType layout)
    {
        Table.Layout = layout;

        return this;
    }

    public TableBuilder<T> Columns(Action<ColumnListBuilder<T>> columns)
    {
        var clb = new ColumnListBuilder<T>(Html);
        columns(clb);

        Table.Columns = clb.Columns;
        Table.Cells = clb.Cells;
        Table.CellRenderers = clb.CellRenderers;

        return this;
    }

    public TableBuilder<T> Rows(Action<RowBuilder<T>> rows)
    {
        var rb = new RowBuilder<T>(Html);
        rows(rb);

        Table.Row = rb.Row;

        return this;
    }

    public TableBuilder<T> Bind(ImlBinding bindings)
    {
        Table.Binding = bindings;

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContent<T> dropdownContent)
    {
        Table.Row.DropdownContent = dropdownContent;

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContentAsync<T> dropdownContentAsync)
    {
        Table.Row.DropdownContent = tmpl =>
                                         {
                                             var awaitable = dropdownContentAsync(tmpl).ConfigureAwait(false);

                                             return awaitable.GetAwaiter().GetResult();
                                         };

        return this;
    }

    public TableBuilder<T> Nested<TNested>(Expression<Func<T, IEnumerable<TNested>>> nestedField, Action<TableBuilder<TNested>> nestedTable)
    {
        var tableBuilder = new TableBuilder<TNested>(Html, Table.Id + "-nested", DefaultStyles);
        tableBuilder.Table.InheritStyles(Table);

        nestedTable(tableBuilder);

        var fieldName = nestedField.GetMemberName();
        Table.NestedField = fieldName;
        Table.NestedTable = new TableRenderer<TNested>(Html, tableBuilder.Table, DefaultStyles).RenderComponent();

        return this;
    }
}
