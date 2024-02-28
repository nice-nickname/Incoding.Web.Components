namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public record TableDto(
        List<ColumnDto> Columns,
        string RowTemplate,
        string ContentHtml
    )
    {
        public string NestedField { get; init; }

        public TableDto NestedTable { get; init; }
    }
}
