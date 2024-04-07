namespace Incoding.Web.Components.Grid;

public static class ColumnTypeExtension
{
    public static ColumnFormat ToColumnFormat(this ColumnType type) =>
            type switch
            {
                    ColumnType.Numeric => ColumnFormat.Numeric,
                    ColumnType.Datetime => ColumnFormat.DateTime,
                    ColumnType.String => ColumnFormat.Empty,
                    ColumnType.Boolean => ColumnFormat.Empty,
                    _ => ColumnFormat.Empty
            };

    public static ColumnType ToColumnType(this ColumnFormat format) =>
            format switch
            {
                    ColumnFormat.Currency => ColumnType.Numeric,
                    ColumnFormat.Percentage => ColumnType.Numeric,
                    ColumnFormat.Numeric => ColumnType.Numeric,

                    ColumnFormat.DateTime => ColumnType.Datetime,

                    _ => ColumnType.String
            };
}
