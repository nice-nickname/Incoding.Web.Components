namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;

#endregion

public record ExpandButtonSettings
{
    public string Content { get; set; }

    public string Css { get; set; }

    public Action<IIncodingMetaLanguageCallbackBodyDsl> OnClick { get; set; }
}

public partial class GridUtilsHtmlHelper
{
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
                    .AsHtmlAttributes(classes: settings.Css)
                    .ToTag(HtmlTag.Button, settings.Content);
    }
}
