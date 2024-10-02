namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.ComponentModel;
using JetBrains.Annotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#endregion

[UsedImplicitly, Description("initializeSplitGrid JS params")]
public record ColumnDto
{
    public int? Id { get; set; }

    public int Index { get; set; }

    public int? ParentIndex { get; set; }

    public string Field { get; set; }

    public string Title { get; set; }

    public int? SpreadIndex { get; set; }

    public string SpreadField { get; set; }

    public bool Totalable { get; set; }

    public bool Sortable { get; set; }

    public int? Width { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public SortOrder? SortedBy { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnType Type { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnFormat Format { get; set; }

    public bool HasDefaultSort => SortedBy.HasValue;
}
