namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using Microsoft.AspNetCore.Html;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#endregion

public record SplitGrid(string Id)
{
    public string Css { get; set; } = string.Empty;

    public string Width { get; set; }

    public string Height { get; set; }

    public List<Table> Tables { get; set; } = [];

    public List<Splitter> Splits { get; set; } = [];

    public string EmptyContent { get; set; }

    public InfiniteScrollOptions InfiniteScroll { get; set; }

    public UIOptions UI { get; set; } = new();

    public FormatOptions Format { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public GridMode Mode { get; set; } = GridMode.SubGrid;
}
