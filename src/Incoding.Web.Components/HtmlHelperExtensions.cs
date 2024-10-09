namespace Incoding.Web.Components;

#region << Using >>

using Incoding.Web.Components.Grid;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class HtmlHelperExtensions
{
    public static SplitGridBuilder<T> Grid<T>(this IHtmlHelper html, string id)
    {
        return new SplitGridBuilder<T>(html, id);
    }
}
