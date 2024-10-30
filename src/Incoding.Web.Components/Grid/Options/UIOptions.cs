namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class UIOptions
{
    public int PlaceholderRows { get; set; } = 20;
}
