namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;

#endregion

public class Column
{
    public int Index { get; set; }

    public int? Width { get; set; }

    public string Title { get; set; }

    public string Css { get; set; } = string.Empty;

    public bool Totalable { get; set; }

    public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();

    public IDictionary<string, string> FooterAttr { get; } = new Dictionary<string, string>();

    public List<Column> Columns { get; } = new();

    public Cell Cell { get; set; }
}
