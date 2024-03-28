namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using Incoding.Core.Extensions;

#endregion

public class Splitter
{
    public string MinWidth { get; set; }

    public string MaxWidth { get; set; }

    public string Width { get; set; }
}

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

    public ImlBinding Binding { get; set; } = null;

    public string NestedField { get; set; }

    public TableComponent NestedTable { get; set; }

    public Table(string id)
    {
        this.Id = id;
    }

    public void InheritStyles<U>(Table<U> parent)
    {
        this.Css = parent.Css;
        this.Row.Css = parent.Row.Css;
        this.Layout = parent.Layout;

        this.Attr.Merge(parent.Attr);
    }
}
