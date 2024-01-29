namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class ColumnHeader
    {
        public string Title { get; set; }

        public List<ColumnHeader> Stacked { get; set; } = new();
    }

    public class Column<T>
    {
        public string Title { get; set; }

        public string Property { get; set; }

        public string Css { get; set; }

        public ColumnType Type { get; set; }

        public TemplateContent<T> Content { get; set; }
    }
}
