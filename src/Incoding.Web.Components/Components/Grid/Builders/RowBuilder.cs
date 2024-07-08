namespace Incoding.Web.Components.Grid;

#region << Using >>

using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class RowBuilder<T>
{
    public RowBuilder(IHtmlHelper html)
    {
        this.Row = new Row<T>();
        this.Html = html;
    }

    public IHtmlHelper Html { get; }

    public Row<T> Row { get; }

    public RowBuilder<T> Css(string css)
    {
        this.Row.Css += " " + css;

        return this;
    }

    public RowBuilder<T> Attr(string attr, string value)
    {
        return Attr(attr, _ => value.ToHtmlString());
    }

    public RowBuilder<T> Attr(string attr, TemplateContent<T> value)
    {
        this.Row.Attr[attr] = value;

        return this;
    }

    public RowBuilder<T> Bind(ImlBinding binding)
    {
        this.Row.Binding = (iml, tmpl) => binding(iml);

        return this;
    }

    public RowBuilder<T> Bind(ImlTemplateBinding<T> binding)
    {
        this.Row.Binding = binding;

        return this;
    }
}
