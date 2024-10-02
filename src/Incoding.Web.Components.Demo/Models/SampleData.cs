using Incoding.Web.Components.Grid;

namespace Incoding.Web.Components.Demo
{
    public record SampleData
    {
        public string Id { get; set; }

        [Column]
        public int Index { get; set; }

        [Column]
        public string Name { get; set; }

        public string Description { get; set; }

        [Column(Format = ColumnFormat.DateTime)]
        public DateTime Start { get; set; }

        [Column(Format = ColumnFormat.DateTime)]
        public DateTime End { get; set; }

        [Column(Format = ColumnFormat.Numeric)]
        public int Amount { get; set; }

        [Column(Format = ColumnFormat.Percentage)]
        public decimal AmountPercentage { get; set; }

        public decimal Balance { get; set; }

        [Column(Format = ColumnFormat.Currency, Stacked = "JTD")]
        public decimal? JTDDollars { get; set; }

        [Column(Stacked = "JTD")]
        public decimal? JTDHours { get; set; }

        public List<SamplePeriod> Period { get; set; } = [];

        public List<SampleData> Children { get; set; } = [];

        public bool HasChildren => Children.Any();

        public string RowId => Id;
    }
}
