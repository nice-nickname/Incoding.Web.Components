using Incoding.Web.Components.Grid;

namespace Incoding.Web.Components;

public class ColumnAttribute : System.Attribute
{
    public string Title { get; set; }

    public ColumnFormat Format { get; set; }

    public int Width { get; set; }
}
