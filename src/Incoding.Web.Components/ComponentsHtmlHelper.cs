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
        _html = html;
    }

    public InputHtmlHelper Inputs => new(_html);

    public GridUtilsHtmlHelper GridUtils => new(_html);

    public SplitGridBuilder<T> Grid<T>(string id)
    {
        return new SplitGridBuilder<T>(_html, id);
    }

    public SplitGridBuilder<dynamic> Grid(string id)
    {
        return new SplitGridBuilder<dynamic>(_html, id);
    }

    public IHtmlContent SignalR(string action)
    {
        return _html.When(JqueryBind.InitIncoding)
                   .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("signalr", action))
                   .AsHtmlAttributes()
                   .ToInput(HtmlInputType.Hidden, string.Empty);
    }

    public IHtmlContent DefaultDecimalPrecision(int precision)
    {
        return _html.When(JqueryBind.InitIncoding)
                         .OnSuccess(dsl => dsl.Self().JQuery.Call("format", "precision", precision))
                         .AsHtmlAttributes()
                         .ToDiv();
    }
}
