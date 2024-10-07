namespace Incoding.Web.Components.Grid;

#region << Using >>

using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class SplitGridRenderer
{
    public SplitGrid Grid { get; }

    public IHtmlHelper Html { get; }

    public ImlBinding Binds { get; set; }

    public SplitGridRenderer(IHtmlHelper html, SplitGrid grid)
    {
        Html = html;
        Grid = grid;
    }

    public IHtmlContent Render()
    {
        var options = Grid.ToJsonString();

        var grid = Html.When(JqueryBind.InitIncoding)
                       .OnSuccess(dsl => dsl.Self().JQuery.Call("initializeSplitGrid", options))
                       .AsHtmlAttributes()
                       .ToDiv();

        return grid;
    }
}
