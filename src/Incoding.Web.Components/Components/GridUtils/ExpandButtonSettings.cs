namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;

#endregion

public record ExpandButtonSettings
{
    public string Content { get; set; }

    public string Css { get; set; }

    public Action<IIncodingMetaLanguageCallbackBodyDsl> OnClick { get; set; }
}
