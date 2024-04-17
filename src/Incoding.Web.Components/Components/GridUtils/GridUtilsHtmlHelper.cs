namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Routing;

#endregion

public class GridUtilsHtmlHelper
{
    private readonly IHtmlHelper _html;

    public GridUtilsHtmlHelper(IHtmlHelper html)
    {
        this._html = html;
    }

    public IHtmlContent ExpandButton(Action<ExpandButtonSettings> buildAction)
    {
        var settings = new ExpandButtonSettings();
        buildAction(settings);

        return this._html.When(JqueryBind.Click)
                    .StopPropagation()
                    .OnSuccess(dsl =>
                    {
                        dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('grid')?.expand", Selector.Jquery.Self().Closest(HtmlTag.Tr).Attr("data-row-id")); // m-controller

                        settings.OnClick?.Invoke(dsl);
                    })
                    .AsHtmlAttributes(new RouteValueDictionary
                    {
                        [HtmlAttribute.Class.ToStringLower()] = settings.Css,
                        ["role"] = "expand"
                    })
                    .ToTag(HtmlTag.Button, settings.Content);
    }

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
