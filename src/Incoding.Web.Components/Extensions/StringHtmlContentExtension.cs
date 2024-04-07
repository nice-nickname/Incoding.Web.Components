namespace Incoding.Web.Components;

#region << Using >>

using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

#endregion

public static class StringHtmlContentExtension
{
    public static IHtmlContent ToHtmlString(this string @string) => new StringHtmlContent(@string);

    public static IHtmlContent ToHtmlString(this IncHtmlString @incString) => new StringHtmlContent(@incString);
}
