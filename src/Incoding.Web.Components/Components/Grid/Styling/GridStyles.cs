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
            TableCss = "table-component table table-bordered"
        };

    public record Stylings
    {
        public string GridCss { get; set; }

        public string GridStackedCss { get; set; }

        public string GridSimpleCss { get; set; }


        public string TableCss { get; set; }


        public string RowCss { get; set; }

        public string EmptyContainerCss { get; } = "grid-empty hidden";


        public string HeaderCellOrderCss { get; } = "order-column";

        public string HeaderCellOrderButtonCss { get; } = "ci-planifi ci-arrow-up-circle ci-color-alt ci-size-18";

        public string HeaderCellFilterCss { get; } = "filter-column";

        public string HeaderCellFilterButtonCss { get; } = "ci-planifi ci-filter ci-color-alt ci-size-18";

        public string HeaderCellResizeCss { get; } = "resize-column";

        public string HeaderCellResizeButtonCss { get; } = "resize-button";


        public string SplitterCss { get; } = "grid-splitter";

        public string SplitterPanelCss { get; } = "splitter-pane";

        public string SplitterDividerCss { get; } = "splitter-divider ci-element";

        public string SplitterDividerIconCss { get; } = "ci-planifi ci-dots-vertical ci-color-muted ci-h-color-base ci-size-24 ci-bg-alt";
    }
}
