namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class Column
{
    public string Uid { get; set; }

    public int? Id { get; set; }

    public int? Index { get; set; }

    public string ParentUid { get; set; }

    public int? MinWidth { get; set; }

    public int? Width { get; set; }

    public string Title { get; set; }

    public string Css { get; set; } = string.Empty;

    public IDictionary<string, string> Attrs { get; } = new Dictionary<string, string>();

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

    [JsonConverter(typeof(StringEnumConverter))]
    public ControlColumn? ControlColumn { get; set; }

    public bool Totalable { get; set; }

    public bool Sortable { get; set; }

    public bool Filterable { get; set; }

    public bool Resizable { get; set; }

    public bool ShowMenu { get; set; } = true;

    public bool AllowEdit { get; set; } = true;

    public bool Hidden { get; set; }

    public bool IsSorted => SortedBy.HasValue;

    public string SummaryExpr { get; set; }

    public Column()
    {
        Uid = Guid.NewGuid().ToString()[..10];
    }

    public Column(ControlColumn controlColumn) : this()
    {
        ControlColumn = controlColumn;

        Totalable = false;
        Filterable = false;
        Sortable = false;
        ShowMenu = false;
        Resizable = false;

        Width = 32;
        MinWidth = 32;
    }
}
