namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class Column
{
    public int? Id { get; set; }

    public int Index { get; set; }

    public int? ParentIndex { get; set; }

    public int? Width { get; set; }

    public string Title { get; set; }

    public string Css { get; set; } = string.Empty;

    public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();

    public List<Column> Stacked { get; } = new();

    public string Field { get; set; }

    public string SpreadField { get; set; }

    public int? SpreadIndex { get; set; }

    public string Executable { get; set; }

    public string Content { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnType Type { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnFormat Format { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnAlignment Alignment { get; set; } = ColumnAlignment.Left;

    [JsonConverter(typeof(StringEnumConverter))]
    public SortOrder? SortedBy { get; set; }

    public bool Totalable { get; set; }

    public bool Sortable { get; set; }

    public bool Filterable { get; set; }

    public bool Resizable { get; set; }

    public bool Hidden { get; set; }

    public bool IsSorted => SortedBy.HasValue;
}
