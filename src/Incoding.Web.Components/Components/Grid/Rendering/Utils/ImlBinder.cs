namespace Incoding.Web.Components.Grid.Rendering;

#region << Using >>

using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class ImlBinder
{
    public static string ToExecutable(IHtmlHelper html, ImlBinding binding)
    {
        var attrs = binding(Noop(html))
                    .AsHtmlAttributes()
                    .ToDictionary(s => s.Key, s => s.Value.ToString());

        return attrs["incoding"];
    }

    public static string ToExecutable<T>(IHtmlHelper html, ITemplateSyntax<T> template, ImlTemplateBinding<T> binding)
    {
        var attrs = binding(Noop(html), template)
                    .AsHtmlAttributes()
                    .ToDictionary(s => s.Key, s => s.Value.ToString());

        return TemplateEncoder.Encode(attrs["incoding"]);
    }

    private static IIncodingMetaLanguageEventBuilderDsl Noop(IHtmlHelper html)
    {
        // When element is TagBuilder, we don't have IIncodingMetaLanguageEventBuilderDsl
        // So we start from noop event
        return html.When("_");
    }
}
