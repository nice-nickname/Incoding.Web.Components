namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;

#endregion

public class Row<T>
{
    public string Css { get; set; } = string.Empty;

    public ImlTemplateBinding<T> Binding { get; set; } = null;

    public TemplateContent<T> DropdownContent { get; set; } = null;

    public IDictionary<string, TemplateContent<T>> Attr { get; } = new Dictionary<string, TemplateContent<T>>();

    public Row()
    {
        Attr.Add("data-row-id", tmpl => tmpl.For("RowId"));
    }
}
