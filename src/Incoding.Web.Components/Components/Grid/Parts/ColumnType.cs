namespace Incoding.Web.Components.Grid
{
    public enum ColumnType
    {
        String,

        Numeric,

        Datetime,

        Boolean,
    }

    public enum ColumnFormat
    {
        Empty,

        Currency,

        Percentage,

        Numeric,

        DateTime
    }

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
    }
}
