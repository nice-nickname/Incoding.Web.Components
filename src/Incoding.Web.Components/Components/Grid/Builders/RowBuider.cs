namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class RowBuilder<T>
    {
        public Row<T> Row { get; }

        public RowBuilder()
        {
            this.Row = new Row<T>();
        }

        public RowBuilder<T> Css(string css)
        {
            this.Row.Css += " " + css;

            return this;
        }
    }
}
