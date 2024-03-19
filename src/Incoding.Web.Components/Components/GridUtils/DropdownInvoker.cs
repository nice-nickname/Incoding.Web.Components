namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;

    #endregion

    public record DropdownInvokerSettings
    {
        public Func<JquerySelector, JquerySelectorExtend> Button { get; set; } = null;

        public string Content { get; set; }

        public string Css { get; set; }

        public object Attrs { get; set; }

        public HtmlTag Tag { get; set; } = HtmlTag.Button;
    }

    public partial class GridUtilsHtmlHelper
    {
        public IHtmlContent DropdownInvoker(Action<DropdownInvokerSettings> buildAction)
        {
            var settings = new DropdownInvokerSettings();
            buildAction(settings);

            var attrs = AttributesHelper.Merge(new
            {
                @class = settings.Css
            }, settings.Attrs);

            attrs["data-dropdown-invoker"] = true;

            return this._html.When(JqueryBind.Click)
                             .StopPropagation()
                             .OnSuccess(dsl =>
                             {
                                 var rowId = Selector.Jquery.Self().Closest(HtmlTag.Tr).Attr("data-row-id");
                                 var dropdownId = settings.Button(Selector.Jquery).ToSelector();

                                 dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('grid')?.showDropdown", rowId, dropdownId); // m-controller
                             })
                             .AsHtmlAttributes(attrs)
                             .ToTag(HtmlTag.Div, settings.Content);
        }
    }
}
