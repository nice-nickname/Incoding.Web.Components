namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.Components.Grid;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class ComponentsHtmlHelper
    {
        private readonly IHtmlHelper _html;

        public ComponentsHtmlHelper(IHtmlHelper html)
        {
            this._html = html;
        }

        public GridBuilder<T> Grid<T>(string id) where T : IRowData
        {
            return new GridBuilder<T>(this._html, id);
        }
    }
}
