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
    private readonly IHtmlHelper _html;

    private readonly Cell<T> _cell;

    public SingleCellRenderer(Cell<T> cell, IHtmlHelper html)
    {
        this._cell = cell;
        this._html = html;
    }

    public void Render(ITemplateSyntax<T> template, TextWriter content)
    {
        var tag = RenderCell(template);

        if (this._cell.Binding != null)
        {
            ImlBinder.BindToTag(this._html, tag, this._cell.Binding, template);
        }

        content.Write(tag.ToHtmlString());
    }

    private TagBuilder RenderCell(ITemplateSyntax<T> template)
{
        var cellTag = TagsFactory.Td();
        cellTag.AddCssClass(this._cell.Column.Css);

        cellTag.AppendStyle(CssStyling.TextAlign, this._cell.Alignment.ToStringLower());

        foreach (var (key, templateValue) in this._cell.Attrs)
        {
            cellTag.Attributes.Add(key, templateValue(template).HtmlContentToString());
        }

        foreach (var tmplAttr in this._cell.TemplateAttrs)
        {
            cellTag.Attributes.Add(tmplAttr(template).HtmlContentToString(), "");
        }

        cellTag.InnerHtml.AppendHtml(this._cell.Content(template));

        return cellTag;
    }
}
