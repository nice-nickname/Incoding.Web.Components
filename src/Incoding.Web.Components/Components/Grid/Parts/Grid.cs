namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using Microsoft.AspNetCore.Html;

#endregion

public class Grid<T>
{
    public string Id { get; }

    public string Css { get; set; } = string.Empty;

    public string Width { get; set; } = "100%";

    public string Height { get; set; } = "100%";

    public List<Table<T>> Tables { get; set; } = new();

    public List<Splitter> Splits { get; set; } = new();

    public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();

    public IHtmlContent EmptyContent { get; set; }

    public InfiniteScrollOptions InfiniteScroll { get; set; }

    public UIOptions UI { get; set; } = new();

    public ImlBinding Binds { get; set; } = null;

    public IGridDataSource DataSource { get; set; } = null;

    public GridMode Mode { get; set; } = GridMode.Stacked;

    public Grid(string id)
    {
        Id = id;
    }
}
