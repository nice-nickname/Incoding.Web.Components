namespace Incoding.Web.Components.Grid
{
    public record ColumnDto(int Index, string Field, string Title)
    {
        public int SpreadIndex { get; init; }

        public string SpreadField { get; init; }

        public bool Totalable { get; set; }

        public ColumnType Type { get; init; }

        public ColumnFormat Format { get; init; }
    }
}
