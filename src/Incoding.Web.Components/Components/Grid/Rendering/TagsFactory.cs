namespace Incoding.Web.Components.Grid;

#region << Using >>

using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class TagsFactory
{
    public static TagBuilder Div() => new TagBuilder(HtmlTag.Div.ToStringLower());

    public static TagBuilder Table() => new TagBuilder(HtmlTag.Table.ToStringLower());

    public static TagBuilder Tr() => new TagBuilder(HtmlTag.Tr.ToStringLower());

    public static TagBuilder Td() => new TagBuilder(HtmlTag.Td.ToStringLower());

    public static TagBuilder Th() => new TagBuilder(HtmlTag.Th.ToStringLower());

    public static TagBuilder THead() => new TagBuilder(HtmlTag.THead.ToStringLower());

    public static TagBuilder TBody() => new TagBuilder(HtmlTag.TBody.ToStringLower());

    public static TagBuilder TFooter() => new TagBuilder("tfoot"); // HtmlTag.TFooter has wrong name

    public static TagBuilder Span() => new TagBuilder(HtmlTag.Span.ToStringLower());
}
