namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableSplitBuilder<T>
{
    public List<Table> Tables { get; }

    public List<Splitter> Splits { get; }

    public IHtmlHelper Html { get; }

    public GridStyles.Style GridStyle { get; init; }

    public bool IsSimpleMode { get; init; }

    private int _index;

    public TableSplitBuilder(IHtmlHelper html)
    {
        Html = html;
        Tables = new List<Table>();
        Splits = new List<Splitter>();

        _index = 0;
    }

    public SplitBuilder Add(Action<TableBuilder<T>> splitter)
    {
        return Add(Guid.NewGuid().ToString(), splitter);
    }

    public SplitBuilder Add(string splitId, Action<TableBuilder<T>> splitter)
    {
        var tableBuilder = new TableBuilder<T>(Html, splitId, GridStyle)
                           {
                                   RenderExpand = _index == 0,
                                   IsSimpleMode = IsSimpleMode
                           };

        var splitBuilder = new SplitBuilder(Html);

        splitter(tableBuilder);

        Tables.Add(tableBuilder.Table);
        Splits.Add(splitBuilder.Splitter);

        _index++;

        return splitBuilder;
    }
}
