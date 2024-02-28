namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public partial class GridUtilsHtmlHelper
    {
        private readonly IHtmlHelper _html;

        public GridUtilsHtmlHelper(IHtmlHelper html)
        {
            this._html = html;
        }
    }
}
