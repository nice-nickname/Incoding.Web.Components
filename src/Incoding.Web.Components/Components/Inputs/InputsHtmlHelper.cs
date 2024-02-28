namespace Incoding.Web.Components
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public partial class InputHtmlHelper
    {
        private readonly IHtmlHelper _html;

        public InputHtmlHelper(IHtmlHelper html)
        {
            this._html = html;
        }
    }
}
