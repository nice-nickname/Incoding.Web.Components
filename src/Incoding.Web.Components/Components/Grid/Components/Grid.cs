namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Grid<T>
    {
        public List<Column<T>> Columns { get; set; }

        public Row<T> Row { get; set; }

        public bool Filterable { get; set; }

        public bool Totalable { get; set; }

        public bool Sortable { get; set; }
        
        public string CssClass { get; set; }

        public string EmptyTemplate { get; set; }

        public string EachName { get; set; }

        public Grid()
        {
            Row = new Row<T>();
            Columns = new List<Column<T>>();

            EmptyTemplate = null;
        }

        public Grid(string eachName)
            : base()
        {
            EachName = eachName;
        }

        public bool HasEmptyTemplate => EmptyTemplate != null;
    }
}
