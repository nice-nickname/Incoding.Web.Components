namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;

#endregion

public static class GridStyles
{
    public static Func<Style> Default = () => new Style
                                              {
                                                      GridCss = "bg-white",
                                                      TableCss = "table table-bordered"
                                              };

    public static Func<Style> Compact = () => new Style
                                              {
                                                      GridCss = "bg-white",
                                                      TableCss = "table table-bordered"
                                              };

    public record Style
    {
        public string GridCss { get; set; }

        public string TableCss { get; set; }

        public string RowCss { get; set; }
    }
}
