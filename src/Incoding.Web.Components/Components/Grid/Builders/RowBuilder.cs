namespace Incoding.Web.Components.Grid;

#region << Using >>

using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class RowBuilder<T>
{
    public Row<T> Row { get; }

    public IHtmlHelper Html { get; }

    public RowBuilder(IHtmlHelper html)
    {
        Row = new Row<T>();
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
        Row.Attr[attr] = value;

        return this;
    }

    public RowBuilder<T> Bind(ImlBinding binding)
    {
        Row.Binding = (iml, tmpl) => binding(iml);

        return this;
    }

    public RowBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        Row.Binding = binding;

        return this;
    }
}
