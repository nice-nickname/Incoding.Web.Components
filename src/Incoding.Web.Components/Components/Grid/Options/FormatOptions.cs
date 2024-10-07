namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Globalization;

#endregion

public record FormatOptions
{
    public int DecimalScale { get; set; }

    public string DateFormat { get; set; }

    public static FormatOptions Default()
    {
        return FromCulture(CultureInfo.CurrentCulture);
    }

    public static FormatOptions FromCulture(CultureInfo culture)
    {
        return new()
               {
                       DecimalScale = culture.NumberFormat.CurrencyDecimalDigits,
                       DateFormat = culture.DateTimeFormat.ShortDatePattern
               };
    }
}
