namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.IO;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class SingleCellRenderer<T> : ICellRenderer<T>
    {
        private readonly Cell<T> _cell;

        public SingleCellRenderer(Cell<T> cell)
        {
            this._cell = cell;
        }

        public void Render(ITemplateSyntax<T> template, TextWriter content)
        {
            var cell = new TagBuilder("td");
            cell.AddCssClass(this._cell.Column.Css);

            cell.InnerHtml.AppendHtml(this._cell.Content(template));
            content.Write(cell.ToHtmlString());
        }
    }
}
