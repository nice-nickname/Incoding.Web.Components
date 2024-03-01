
namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Row<T> where T : IRowData
    {
        public string Css { get; set; } = string.Empty;

        public IDictionary<string, TemplateContent<T>> Attr { get; } = new Dictionary<string, TemplateContent<T>>();

        public Row()
        {
            this.Attr.Add("data-row-id", tmpl => tmpl.For(s => s.RowId).ToHtmlString());
        }
    }
}
