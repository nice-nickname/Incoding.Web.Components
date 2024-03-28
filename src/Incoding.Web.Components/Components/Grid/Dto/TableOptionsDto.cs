namespace Incoding.Web.Components.Grid;

public record TableOptionsDto
{
    public bool HighlightRows { get; set; }

    public bool CascadeEvents { get; set; }

    public int PlaceholderRows { get; set; }
}
