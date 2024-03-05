namespace Incoding.Web.Components.Demo
{
    #region << Using >>

    using Incoding.Web.Components.Grid;

    #endregion

    public record SampleData : IRowData
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public int Amount { get; set; }

        public decimal AmountPercentage { get; set; }

        public decimal Balance { get; set; }

        public decimal? JTDDollars { get; set; }

        public decimal? JTDHours { get; set; }

        public List<SamplePeriod> Period { get; set; } = new List<SamplePeriod>();

        public List<SampleData> Children { get; set; } = new List<SampleData>();

        public bool HasChildren => Children.Any();

        public string RowId => this.Id;
    }
}
