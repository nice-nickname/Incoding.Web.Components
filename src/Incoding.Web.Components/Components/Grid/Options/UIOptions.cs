namespace Incoding.Web.Components.Grid;

public record UIOptions
{
    public bool HighlightRowsOnHover { get; set; } = true;

    public int PlaceholderRows { get; set; } = 20;

    public bool Zebra { get; set; }
}
