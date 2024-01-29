
namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Grid<T>
    {
        public string Id { get; set; }

        public string Css { get; set; }

        public Row<T> Row { get; set; }

        public List<ColumnHeader> Header { get; set; }

        public List<Column<T>> Columns { get; set; }
    }
}
