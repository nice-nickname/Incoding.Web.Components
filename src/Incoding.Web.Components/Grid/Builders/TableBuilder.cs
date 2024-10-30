namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Incoding.Core.Block.IoC;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableBuilder<T>
{
    private readonly ITemplateSyntax<T> _template;

    private readonly GridStyles.Style _gridStyle;

    public Table Table { get; }

    public IHtmlHelper Html { get; }

    public bool RenderExpand { get; init; }

    public bool IsSimpleMode { get; set; }

    public int MaxSpecialColumnsCount { get; set; }

    private bool _hasDropdownButton;

    private bool _hasExpandButton;

    public TableBuilder(IHtmlHelper html, string id, GridStyles.Style gridStyle)
    {
        Html = html;
        _gridStyle = gridStyle;
        Table = new Table(id);

        Css(_gridStyle.TableCss);
        Rows(row => row.Css(_gridStyle.RowCss));

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
        InsertDropdownColumn();

        Table.Row.DropdownTmpl = TemplateEncoder.Encode(dropdownContent(_template).HtmlContentToString());

        return this;
    }

    public TableBuilder<T> DropdownTmpl(TemplateContentAsync<T> dropdownContentAsync)
    {
        DropdownTmpl(tmpl => dropdownContentAsync(tmpl).ConfigureAwait(false)
                                                       .GetAwaiter()
                                                       .GetResult());

        return this;
    }

    public TableBuilder<T> Summary(Action<TableSummary> tableSummary)
    {
        var summary = new TableSummary();
        tableSummary(summary);

        Table.Summary = summary;
        return this;
    }

    public TableBuilder<T> Nested<TNested>(Expression<Func<T, IEnumerable<TNested>>> nestedField, Action<TableBuilder<TNested>> nestedTable)
    {
        if (RenderExpand)
            InsertExpandColumn();

        var tableBuilder = new TableBuilder<TNested>(Html, Table.Id + "-nested", _gridStyle)
                           {
                                   RenderExpand = RenderExpand,
                                   IsSimpleMode = true
                           };

        nestedTable(tableBuilder);

        if (IsSimpleMode && _hasExpandButton && !tableBuilder._hasExpandButton)
            tableBuilder.InsertExpandColumn();

        if (IsSimpleMode && _hasDropdownButton && !tableBuilder._hasDropdownButton)
            tableBuilder.InsertDropdownColumn();

        if (IsSimpleMode)
            CopyUids(Table.Columns, tableBuilder.Table.Columns);

        var fieldName = nestedField.GetMemberName();
        Table.NestedField = fieldName;
        Table.Nested = tableBuilder.Table;

        return this;

        void CopyUids(List<Column> original, List<Column> nested)
        {
            foreach (var (oColumn, nColumn) in original.Zip(nested))
            {
                nColumn.Uid = oColumn.Uid;
                if (nColumn.Stacked != null && nColumn.Stacked.Count != 0)
                {
                    CopyUids(oColumn.Stacked, nColumn.Stacked);
                }
            }
        }
    }

    private void InsertExpandColumn()
    {
        Table.Columns.Insert(0, new Column(SpecialColumnKind.Expand));
        _hasExpandButton = true;
    }

    private void InsertDropdownColumn()
    {
        var dropdownButtonIndex = 0;
        if (Table.Columns.FirstOrDefault() is { SpecialColumnKind: SpecialColumnKind.Expand })
            dropdownButtonIndex = 1;

        Table.Columns.Insert(dropdownButtonIndex, new Column(SpecialColumnKind.Dropdown));
        _hasDropdownButton = true;
    }
}
