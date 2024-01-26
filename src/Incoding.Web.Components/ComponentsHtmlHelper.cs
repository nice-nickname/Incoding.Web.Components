namespace Incoding.Web.Components
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class ComponentsHtmlHelper
    {
        private readonly IHtmlHelper _html;

        public ComponentsHtmlHelper(IHtmlHelper html)
        {
            this._html = html;
        }
    }
}
