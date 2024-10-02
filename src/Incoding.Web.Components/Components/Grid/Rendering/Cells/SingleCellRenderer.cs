namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.IO;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class SingleCellRenderer<T> : ICellRenderer<T>
{
    private readonly Cell<T> _cell;

    private readonly IHtmlHelper _html;

    public SingleCellRenderer(Cell<T> cell, IHtmlHelper html)
    {
        _cell = cell;
        _html = html;
    }

    public void Render(ITemplateSyntax<T> template, TextWriter content)
    {
        var tag = RenderCell(template);

        if (_cell.Binding != null)
        {
            ImlBinder.BindToTag(_html, tag, _cell.Binding, template);
        }

        content.Write(tag.ToHtmlString());
    }

    private TagBuilder RenderCell(ITemplateSyntax<T> template)
    {
        var cellTag = TagsFactory.Td();
        cellTag.AddCssClass(_cell.Column.Css);

        cellTag.AppendStyle(CssStyling.TextAlign, _cell.Alignment.ToStringLower());

        foreach (var (key, templateValue) in _cell.Attrs)
        {
            cellTag.Attributes.Add(key, templateValue(template).HtmlContentToString());
        }

        foreach (var tmplAttr in _cell.TemplateAttrs)
        {
            cellTag.Attributes.Add(tmplAttr(template).HtmlContentToString(), "");
        }

        cellTag.InnerHtml.AppendHtml(_cell.Content(template));

        return cellTag;
    }
}
