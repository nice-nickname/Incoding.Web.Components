namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public record TableDto
    {
        public string RowTemplate { get; set; }

        public string LayoutHtml { get; set; }

        public string NestedField { get; set; }

        public TableDto NestedTable { get; set; }

        public List<ColumnDto> Columns { get; set; }
    }
}
