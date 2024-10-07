namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableSplitBuilder<T>
{
    public List<Table> Tables { get; }

    public List<Splitter> Splits { get; }

    public IHtmlHelper Html { get; }

    public TableSplitBuilder(IHtmlHelper html)
    {
        Html = html;
        Tables = new List<Table>();
        Splits = new List<Splitter>();
    }

    public SplitBuilder Add(Action<TableBuilder<T>> splitter)
    {
        return Add(Guid.NewGuid().ToString(), splitter);
    }

    public SplitBuilder Add(string splitId, Action<TableBuilder<T>> splitter)
    {
        var tableBuilder = new TableBuilder<T>(Html, splitId);
        var splitBuilder = new SplitBuilder(Html);

        splitter(tableBuilder);

        Tables.Add(tableBuilder.Table);
        Splits.Add(splitBuilder.Splitter);

        return splitBuilder;
    }
}
