namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#endregion

public record ColumnDto
{
    public int Index { get; set; }

    public string Field { get; set; }

    public string Title { get; set; }

    public int? SpreadIndex { get; set; }

    public string SpreadField { get; set; }

    public bool Totalable { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnType Type { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public ColumnFormat Format { get; set; }
}
