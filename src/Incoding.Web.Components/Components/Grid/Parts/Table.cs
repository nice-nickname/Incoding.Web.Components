namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using Incoding.Core.Extensions;

#endregion

public class Table<T>
{
    public string Id { get; }

    public string Css { get; set; } = string.Empty;

    public LayoutType Layout { get; set; } = LayoutType.Fixed;

    public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();

    public Row<T> Row { get; set; } = new();

    public List<Column> Columns { get; set; } = new();

    public List<Cell> Cells { get; set; } = new();

    public List<ICellRenderer<T>> CellRenderers { get; set; } = new();

    public string NestedField { get; set; }

    public TableComponent NestedTable { get; set; }

    public Table(string id)
    {
        Id = id;
    }

    public void InheritStyles<U>(Table<U> parent)
    {
        Css = parent.Css;
        Row.Css = parent.Row.Css;
        Layout = parent.Layout;

        Attr.Merge(parent.Attr);
    }
}
