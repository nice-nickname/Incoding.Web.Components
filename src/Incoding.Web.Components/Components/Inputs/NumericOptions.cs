namespace Incoding.Web.Components
{
    #region << Using >>

    #endregion

    public record NumericOptions
    {
        public enum OfType
        {
            Decimal,

            Currency,

            Percentage
        }

        public bool AllowNegative { get; set; } = true;

        public bool AllowNullable { get; set; } = false;

        public int DecimalScale { get; set; } = ComponentsDefaults.DecimalScale;

        public OfType Type { get; set; } = OfType.Decimal;

        public InputOptions Input = new();
    }
}
