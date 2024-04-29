namespace Incoding.Web.Components;

#region << Using >>

using Incoding.Web.Components.Grid;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ComponentsHtmlHelper
{
    private readonly IHtmlHelper _html;

    public ComponentsHtmlHelper(IHtmlHelper html)
    {
        this._html = html;
    }

    public InputHtmlHelper Inputs => new InputHtmlHelper(this._html);

    public GridUtilsHtmlHelper GridUtils => new GridUtilsHtmlHelper(this._html);

    public SplitGridBuilder<T> Grid<T>(string id)
    {
        return new SplitGridBuilder<T>(this._html, id);
    }

    public IHtmlContent SignalR(string action)
    {
        return this._html.When(JqueryBind.InitIncoding)
                   .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("signalr", action))
                   .AsHtmlAttributes()
                   .ToInput(HtmlInputType.Hidden, string.Empty);
    }

    public IHtmlContent DefaultDecimalPrecision(int precision)
    {
        return this._html.When(JqueryBind.InitIncoding)
                         .OnSuccess(dsl => dsl.Self().JQuery.Call("format", "precision", precision))
                         .AsHtmlAttributes()
                         .ToDiv();
    }
}
