namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;

#endregion

public record DropdownInvokerSettings
{
    public string Content { get; set; }

    public string Css { get; set; }

    public object Attrs { get; set; }

    public HtmlTag Tag { get; set; } = HtmlTag.Button;
}
