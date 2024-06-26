namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;

#endregion

public static class GridStyles
{
    public static Func<Stylings> Default = () =>
        new Stylings
        {
            GridCss = "grid-component",
            TableCss = "table-component"
        };

    public record Stylings
    {
        public string GridCss { get; set; }

        public string GridStackedCss { get; set; }

        public string GridSimpleCss { get; set; }


        public string TableCss { get; set; }


        public string RowCss { get; set; }

        public string EmptyContainerCss { get; } = "grid-empty hidden";


        public string SplitterCss { get; } = "grid-splitter";

        public string SplitterPanelCss { get; } = "splitter-pane";

        public string SplitterDividerCss { get; } = "splitter-divider ci-element";

        public string SplitterDividerIconCss { get; } = "ci-planifi ci-dots-vertical ci-color-muted ci-h-color-base ci-size-24 ci-bg-alt";
    }
}
