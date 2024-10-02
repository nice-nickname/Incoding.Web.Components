namespace Incoding.Web.Components;

#region << Using >>

using System;
using System.IO;
using System.Text;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public sealed class StringifiedHtmlHelperWrapper<T> : IDisposable
{
    private readonly IHtmlHelper _html;

    private readonly TextWriter _originWriter;

    private readonly MvcTemplate<T> _template;

    public TextWriter ContentWriter { get; }

    public ITemplateSyntax<T> TemplateSyntax { get; }

    public StringifiedHtmlHelperWrapper(IHtmlHelper html, StringBuilder content)
    {
        ContentWriter = new StringWriter(content);

        _html = html;
        _originWriter = _html.ViewContext.Writer;
        _html.ViewContext.Writer = ContentWriter;

        _template = html.Incoding().Template<T>();

        TemplateSyntax = _template.ForEach();
    }

    public void Dispose()
    {
        TemplateSyntax.Dispose();
        _template.Dispose();

        _html.ViewContext.Writer = _originWriter;
    }
}
