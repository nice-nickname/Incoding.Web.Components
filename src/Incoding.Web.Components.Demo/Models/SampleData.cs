namespace Incoding.Web.Components.Demo
{
    public record SamplePeriod
    {
        public decimal JTD { get; set; }

        public decimal HOurs { get; set; }
    }

    public record SampleData
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
    }
}
