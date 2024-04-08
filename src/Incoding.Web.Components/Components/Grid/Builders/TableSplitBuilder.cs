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
        this.Html = html;

        this.Tables = new List<Table<T>>();
        this.Splits = new List<Splitter>();
        this.DefaultStyles = styles;
    }

    public SplitBuilder Add(string splitId, Action<TableBuilder<T>> splitter)
    {
        var tableBuilder = new TableBuilder<T>(this.Html, splitId, this.DefaultStyles);
        var splitBuilder = new SplitBuilder(this.Html);

        splitter(tableBuilder);

        this.Tables.Add(tableBuilder.Table);
        this.Splits.Add(splitBuilder.Splitter);

        return splitBuilder;
    }
}
