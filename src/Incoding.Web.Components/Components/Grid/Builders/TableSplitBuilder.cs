namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableSplitBuilder<T>
{
    public List<Table<T>> Tables { get; }

    public List<Splitter> Splits { get; }

    public IHtmlHelper Html { get; }

    public GridStyles.Stylings DefaultStyles { get; }

    public TableSplitBuilder(IHtmlHelper html, GridStyles.Stylings styles)
    {
        Html = html;

        Tables = new List<Table<T>>();
        Splits = new List<Splitter>();
        DefaultStyles = styles;
    }

    public SplitBuilder Add(Action<TableBuilder<T>> splitter)
    {
        return Add(Guid.NewGuid().ToString(), splitter);
    }

    public SplitBuilder Add(string splitId, Action<TableBuilder<T>> splitter)
    {
        var tableBuilder = new TableBuilder<T>(Html, splitId, DefaultStyles);
        var splitBuilder = new SplitBuilder(Html);

        splitter(tableBuilder);

        Tables.Add(tableBuilder.Table);
        Splits.Add(splitBuilder.Splitter);

        return splitBuilder;
    }
}
