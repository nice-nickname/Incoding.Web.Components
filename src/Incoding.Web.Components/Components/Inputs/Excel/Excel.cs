namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;

    #endregion

    public partial class InputHtmlHelper
    {
        public IHtmlContent Excel()
        {
            return this._html.When(JqueryBind.InitIncoding)
                        .OnSuccess(dsl => dsl.Self())
                        .AsHtmlAttributes()
                        .ToTag(HtmlTag.Input);
        }
    }
}
