namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;

#endregion

public class Row
{
    public string Css { get; set; } = string.Empty;

    public string Executable { get; set; }

    public string DropdownTmpl { get; set; }

    public IDictionary<string, string> Attr { get; } = new Dictionary<string, string>();
}
