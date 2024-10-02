namespace Incoding.Web.Components;

#region << Using >>

using System;
using Incoding.Web.Components.Grid;

#endregion

public class ColumnAttribute : Attribute
{
    public string Title { get; set; }

    public string Field { get; set; }

    public int Width { get; set; }

    public string Stacked { get; set; }

    public ColumnFormat Format { get; set; }

    public ColumnType Type { get; set; }
}
