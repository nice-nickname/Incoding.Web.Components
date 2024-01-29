namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Linq;
    using Incoding.Web.Extensions;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridRenderer<T>
    {
        private readonly Grid<T> _grid;

        public GridRenderer(Grid<T> grid)
        {
            this._grid = grid;
        }

        public IHtmlContent Render()
        {
            return "".ToMvcHtmlString();
        }

        private TagBuilder Table()
        {
            var table = new TagBuilder("table");
            table.AddCssClass(this._grid.Css);

            return table;
        }

        private TagBuilder Thead()
        {
            var thead = new TagBuilder("thead");
            var tr = new TagBuilder("tr");

            foreach (var headerCell in this._grid.Header)
            {
                var th = new TagBuilder("th");
                th.InnerHtml.Append(headerCell.Title);

                tr.InnerHtml.AppendHtml(th);
            }

            thead.InnerHtml.AppendHtml(tr);

            tr = new TagBuilder("tr");

            foreach (var headerCell in this._grid.Header.Where(s => s.Stacked.Any())
                                            .SelectMany(s => s.Stacked))
            {
                var th = new TagBuilder("th");
                th.InnerHtml.Append(headerCell.Title);

                tr.InnerHtml.AppendHtml(th);
            }

            return thead;
        }

        private TagBuilder Row()
        {
            var tr = new TagBuilder("tr");
            tr.AddCssClass(this._grid.Row.Css);

            foreach (var column in this._grid.Columns)
            {

            }

            return tr;
        }

        private TagBuilder Cell(Column<T> column, IHtmlContent content)
        {
            var td = new TagBuilder("td");
            td.AddCssClass(column.Css);

            td.InnerHtml.AppendHtml(content);

            return td;
        }
    }
}
