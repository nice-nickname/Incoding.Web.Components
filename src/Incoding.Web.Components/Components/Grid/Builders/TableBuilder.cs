namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Incoding.Core.Block.IoC;
using Incoding.Core.Extensions;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableBuilder<T>
{
    private readonly ITemplateSyntax<T> _template;

    public Table Table { get; }

    public IHtmlHelper Html { get; }

    public TableBuilder(IHtmlHelper html, string id)
    {
        Html = html;
        Table = new Table(id);

        _template = IoCFactory.Instance.TryResolve<ITemplateFactory>().ForEach<T>(html);
    }

    public TableBuilder<T> Css(string css)
    {
        Table.Css += " " + css;

        return this;
    }

    public TableBuilder<T> Columns(Action<ColumnListBuilder<T>> columns)
    {
        var clb = new ColumnListBuilder<T>(Html)
                  {
                          Template = _template
                  };

        columns(clb);

        Table.Columns = clb.Columns;

        return this;
    }

    public TableBuilder<T> Rows(Action<RowBuilder<T>> rows)
    {
        var rb = new RowBuilder<T>(Html) { Template = _template };
        rows(rb);

        Table.Row = rb.Row;

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContent<T> dropdownContent)
    {
        Table.Row.DropdownTmpl = dropdownContent(_template).HtmlContentToString();

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContentAsync<T> dropdownContentAsync)
    {
        Table.Row.DropdownTmpl = dropdownContentAsync(_template).ConfigureAwait(false)
                                                                .GetAwaiter()
                                                                .GetResult()
                                                                .HtmlContentToString();

        return this;
    }

    public TableBuilder<T> Nested<TNested>(Expression<Func<T, IEnumerable<TNested>>> nestedField, Action<TableBuilder<TNested>> nestedTable)
    {
        var tableBuilder = new TableBuilder<TNested>(Html, Table.Id + "-nested");
        tableBuilder.Table.InheritStyles(Table);

        nestedTable(tableBuilder);

        var fieldName = nestedField.GetMemberName();
        Table.NestedField = fieldName;
        Table.Nested = tableBuilder.Table;

        return this;
    }
}
