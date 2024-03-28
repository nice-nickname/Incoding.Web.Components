namespace Incoding.Web.Components;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;

#endregion

public record InputOptions
{
    public string Value { get; set; }

    public string Css { get; set; }

    public string Name { get; set; }

    public object Attrs { get; set; }

    public string Placeholder { get; set; }

    public Action<IIncodingMetaLanguageCallbackBodyDsl> OnInit { get; set; }

    public Action<IIncodingMetaLanguageCallbackBodyDsl> OnChange { get; set; }
}
