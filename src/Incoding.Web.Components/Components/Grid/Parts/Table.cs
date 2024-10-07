namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;

#endregion

public class Table
{
    public string Id { get; }

    public string Css { get; set; } = string.Empty;

    public Row Row { get; set; } = new();

    public List<Column> Columns { get; set; } = new();

    public string NestedField { get; set; }

    public Table Nested { get; set; }

    public Table(string id)
    {
        Id = id;
    }

    public void InheritStyles(Table parent)
    {
        Css = parent.Css;
        Row.Css = parent.Row.Css;
    }
}
