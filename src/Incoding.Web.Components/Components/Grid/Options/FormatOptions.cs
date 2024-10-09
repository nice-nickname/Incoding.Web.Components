namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public record FormatOptions
{
    public string PositiveNumberPattern { get; set; }

    public string NegativeNumberPattern { get; set; }

    public string DateTimePattern { get; set; }

    public static FormatOptions Default()
    {
        return new()
               {
                       PositiveNumberPattern = "#,##0.00",
                       NegativeNumberPattern = "(#,##0.00)",
                       DateTimePattern = "mm/dd/YYYY"
               };
    }
}
