namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using System.Linq;

    #endregion

    public class Table<T> where T : IRowData
    {
        public string Id { get; }

        public string Css { get; set; } = string.Empty;

        public LayoutType Layout { get; set; } = LayoutType.Fixed;

        public Row<T> Row { get; set; } = new();

        public List<Column> Columns { get; set; } = new();

        public List<Cell> Cells { get; set; } = new();

        public List<ICellRenderer<T>> CellRenderers { get; set; } = new();

        public ImlBinding Binding { get; set; } = iml => iml.When("_").OnSuccess(dsl => dsl.Self());

        public string NestedField { get; set; }

        public TableComponent NestedTable { get; set; }

        public Table(string id)
        {
            this.Id = id;
        }

        public void InheritStyles<U>(Table<U> other) where U : IRowData
        {
            this.Css = other.Css;
            this.Row.Css = other.Row.Css;
            this.Layout = other.Layout;
        }
    }
}
