namespace Incoding.Web.Components.Grid;

#region << Using >>

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public record FormatOptions
{
    public int DecimalScale { get; set; }

    public static FormatOptions Default()
    {
        return new()
               {
                    DecimalScale = 2
               };
    }
}
