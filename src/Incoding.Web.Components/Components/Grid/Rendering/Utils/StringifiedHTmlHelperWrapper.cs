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

    private readonly MvcTemplate<T> _template;

    private readonly TextWriter _originWriter;

    public TextWriter ContentWriter { get; }

    public ITemplateSyntax<T> TemplateSyntax { get; }

    public StringifiedHtmlHelperWrapper(IHtmlHelper html, StringBuilder content)
    {
        this.ContentWriter = new StringWriter(content);

        this._html = html;
        this._originWriter = this._html.ViewContext.Writer;
        this._html.ViewContext.Writer = this.ContentWriter;

        this._template = html.Incoding().Template<T>();

        this.TemplateSyntax = this._template.ForEach();
    }

    public void Dispose()
    {
        this.TemplateSyntax.Dispose();
        this._template.Dispose();

        this._html.ViewContext.Writer = this._originWriter;
    }
}
