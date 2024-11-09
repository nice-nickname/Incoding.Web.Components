namespace Incoding.Web.Components.Grid;

#region << Using >>

using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public record FormatOptions
{
    public int DecimalScale { get; set; }

    public static FormatOptions Default(IHtmlHelper html)
    {
        return new()
               {
                    DecimalScale = 2
               };
    }
}
