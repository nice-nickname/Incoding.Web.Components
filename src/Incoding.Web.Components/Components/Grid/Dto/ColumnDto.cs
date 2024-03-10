namespace Incoding.Web.Components.Grid
{
    public record ColumnDto
    {
        public int Index { get; set; }

        public string Field { get; set; }

        public string Title { get; set; }

        public int SpreadIndex { get; set; }

        public string SpreadField { get; set; }

        public bool Totalable { get; set; }

        public ColumnType Type { get; set; }

        public ColumnFormat Format { get; set; }
    }
}
