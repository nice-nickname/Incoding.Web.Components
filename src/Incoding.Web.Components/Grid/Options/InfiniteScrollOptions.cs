namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public record InfiniteScrollOptions
{
    public int ChunkSize { get; set; } = 40;

    public int LoadingRowsCount { get; set; } = 3;
}
