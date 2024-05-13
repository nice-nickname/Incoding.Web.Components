namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.ComponentModel;
using JetBrains.Annotations;

#endregion

[UsedImplicitly, Description("initializeSplitGrid JS params")]
public record GridStructureDto
{
    public ColumnDto[] Columns { get; set; }

    public string LayoutTmpl { get; set; }

    public string RowTmpl { get; set; }


    public bool HasDropdown { get; set; }

    public string DropdownTmpl { get; set; }


    public string NestedField { get; set; }

    public GridStructureDto Nested { get; set; }
}
