namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.ComponentModel;
using JetBrains.Annotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#endregion

[UsedImplicitly, Description("initializeSplitGrid JS params")]
public record TableOptionsDto
{
    public bool HighlightRows { get; set; }

    public bool Zebra { get; set; }

    public int PlaceholderRows { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public GridMode Mode { get; set; }
}
