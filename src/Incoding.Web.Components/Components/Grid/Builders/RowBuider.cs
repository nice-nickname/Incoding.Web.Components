namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class RowBuilder<T>
    {
        private readonly Row<T> _row;

        public RowBuilder()
        {
            this._row = new Row<T>();
        }

        public RowBuilder<T> Css(string css)
        {
            this._row.Css = css;

            return this;
        }

        internal Row<T> Row => this._row;
    }
}
