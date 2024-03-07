namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class SplitBuilder
    {
        public Splitter Splitter { get; }

        public SplitBuilder()
        {
            Splitter = new Splitter();
        }

        public SplitBuilder Min(string width)
        {
            this.Splitter.MinWidth = width;

            return this;
        }

        public SplitBuilder Max(string width)
        {
            this.Splitter.MaxWidth = width;

            return this;
        }

        public SplitBuilder Width(string width)
        {
            this.Splitter.Width = width;

            return this;
        }
    }
}
