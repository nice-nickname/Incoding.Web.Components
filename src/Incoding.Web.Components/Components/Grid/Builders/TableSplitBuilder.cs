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

    public TableSplitBuilder(IHtmlHelper html)
    {
        this.Html = html;

        this.Tables = new List<Table<T>>();
        this.Splits = new List<Splitter>();
    }

    public SplitBuilder Add(string splitId, Action<TableBuilder<T>> buildAction)
    {
        var tableBuilder = new TableBuilder<T>(this.Html, splitId);
        var splitBuilder = new SplitBuilder(this.Html);

        buildAction(tableBuilder);

        this.Tables.Add(tableBuilder.Table);
        this.Splits.Add(splitBuilder.Splitter);

        return splitBuilder;
    }
}
