namespace Incoding.Web.Components.Grid;

#region << Using >>

using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class RowBuilder<T>
{
    public Row Row { get; }

    public IHtmlHelper Html { get; }

    public ITemplateSyntax<T> Template { get; set; }

    public RowBuilder(IHtmlHelper html)
    {
        Row = new Row();
        Html = html;
    }

    public RowBuilder<T> Css(string css)
    {
        Row.Css += " " + css;

        return this;
    }

    public RowBuilder<T> Attr(string attr, string value)
    {
        return Attr(attr, _ => value.ToHtmlString());
    }

    public RowBuilder<T> Attr(string attr, TemplateContent<T> value)
    {
        Row.Attr[attr] = value(Template).HtmlContentToString();

        return this;
    }

    public RowBuilder<T> Bind(ImlBinding binding)
    {
        Row.Executable = ImlBinder.ToExecutable(Html, binding);

        return this;
    }

    public RowBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        Row.Executable = ImlBinder.ToExecutable(Html, Template, binding);

        return this;
    }
}
