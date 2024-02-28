namespace Incoding.Web.Components.Grid
{
    public record ColumnDto(string Field, string Title)
    {
        public int SpreadIndex { get; init; }

        public string SpreadField { get; init; }

        public ColumnType Type { get; init; }

        public ColumnFormat Format { get; init; }
    }
}
