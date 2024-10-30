namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class Splitter
{
    public string MinWidth { get; set; }

    public string MaxWidth { get; set; }
}
