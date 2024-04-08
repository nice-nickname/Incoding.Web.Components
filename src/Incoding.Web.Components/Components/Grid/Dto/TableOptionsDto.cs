namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.ComponentModel;
using JetBrains.Annotations;

#endregion

[UsedImplicitly]
[Description("JS params")]
public record TableOptionsDto
{
    public bool HighlightRows { get; set; }

    public bool CascadeEvents { get; set; }

    public int PlaceholderRows { get; set; }
}
