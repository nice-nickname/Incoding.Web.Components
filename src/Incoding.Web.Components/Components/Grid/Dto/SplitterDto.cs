namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.ComponentModel;
using JetBrains.Annotations;

#endregion

[UsedImplicitly, Description("initializeSplitGrid JS params")]
public record SplitterDto
{
    public string Min { get; set; }

    public string Max { get; set; }
}
