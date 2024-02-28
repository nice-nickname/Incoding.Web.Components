namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Column
    {
        public int Index { get; set; }

        public int? Width { get; set; }

        public string Title { get; set; }

        public string Css { get; set; } = string.Empty;

        public List<Column> Columns { get; } = new();
    }
}
