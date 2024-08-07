namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;

#endregion

public class Cell
{
    public string Field { get; set; }

    public string SpreadField { get; set; }

    public int? SpreadIndex { get; set; }

    public ColumnType Type { get; set; }

    public ColumnFormat Format { get; set; }

    public ColumnAlignment Alignment { get; set; } = ColumnAlignment.Left;

    public Column Column { get; set; }
}

public class Cell<T> : Cell
{
    public List<TemplateContent<T>> TemplateAttrs { get; } = new List<TemplateContent<T>>();

    public IDictionary<string, TemplateContent<T>> Attrs { get; } = new Dictionary<string, TemplateContent<T>>();

    public TemplateContent<T> Content { get; set; }

    public ImlTemplateBinding<T> Binding { get; set; }
}
