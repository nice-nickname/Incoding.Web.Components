namespace Incoding.Web.Components.Grid.Rendering;

#region << Using >>

using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class ImlBinder
{
    public static void BindToTag(IHtmlHelper html, TagBuilder tag, ImlBinding binding)
    {
        var incodingAttrs = binding(Noop(html))
                            .AsHtmlAttributes()
                            .ToDictionary(s => s.Key, s => s.Value.ToString());

        tag.Attributes.Merge(incodingAttrs);
    }

    public static void BindToTag<T>(IHtmlHelper html, TagBuilder tag, ImlTemplateBinding<T> binding, ITemplateSyntax<T> tmpl)
    {
        var incodingAttrs = binding(Noop(html), tmpl)
                            .AsHtmlAttributes()
                            .ToDictionary(s => s.Key, s => s.Value.ToString());

        tag.Attributes.Merge(incodingAttrs);
    }

    private static IIncodingMetaLanguageEventBuilderDsl Noop(IHtmlHelper html)
    {
        // When element is TagBuilder, we don't have IIncodingMetaLanguageEventbuilderDsl
        // So we start from noop event
        return html.When("_");
    }
}
