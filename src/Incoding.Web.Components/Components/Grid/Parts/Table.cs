namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using Incoding.Web.MvcContrib;

    #endregion

    public class Table<T>
    {
        public Table(string id)
        {
            this.Id = id;
        }

        public string Id { get; }

        public string Css { get; set; } = string.Empty;

        public Row<T> Row { get; set; } = new();

        public List<Column> Columns { get; set; } = new();

        public List<Cell> Cells { get; set; } = new();

        public List<ICellRenderer<T>> CellRenderers { get; set; } = new();

        public ImlBinding Binding { get; set; } = iml => iml.When("_").OnSuccess(dsl => dsl.Self());

        public TableComponent NestedTable { get; set; }
    }
}
