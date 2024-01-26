namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridTemplateRenderer<TModel>
    {
        private const int DefaultBuilderCapacity = 1024 * 4;

        private readonly Grid<TModel> _grid;

        private readonly IHtmlHelper _html;

        public GridTemplateRenderer(IHtmlHelper html, Grid<TModel> grid)
        {
            this._html = html;
            this._grid = grid;
        }

        public HtmlString RenderTmpl()
        {
            var templateContent = RenderTable();

            if (this._grid.HasEmptyTemplate)
            {
                templateContent += RenderEmptyTemplate();
            }

            return templateContent.ToMvcHtmlString();
        }

        public string RenderTable()
        {
            var sb = new StringBuilder(DefaultBuilderCapacity);

            var incodingAttributes = this._html.When(JqueryBind.InitIncoding)
                                         .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("initializeGridHelper"))
                                         .OnComplete(dsl => dsl.Self().JQuery.Call("_totalSum"))
                                         .AsHtmlAttributes(new
                                                           {
                                                                   @class = this._grid.CssClass
                                                           });

            var table = new TagBuilder("table");

            var thead = RenderTHead();
            var tbody = RenderTBody();
            var tfoot = RenderTFoot();

            sb.Append(thead.HtmlContentToString());
            sb.Append(tbody.HtmlContentToString());
            sb.Append(tfoot.HtmlContentToString());

            table.MergeAttributes(incodingAttributes);
            table.InnerHtml.AppendHtml(sb.ToString());

            return table.HtmlContentToString();
        }

        private string RenderEmptyTemplate()
        {
            var sb = new StringBuilder();

            using (new StringWrapperHtmlHelper(this._html, sb))
            {
                using (var template = this._html.Incoding().Template<TModel>())
                {
                    using (string.IsNullOrWhiteSpace(this._grid.EachName)
                                   ? template.NotEach()
                                   : new TemplateHandlebarsSyntax<TModel>(this._html, this._grid.EachName, HandlebarsType.Unless, string.Empty))
                    {
                        sb.Append(this._html.When(JqueryBind.InitIncoding)
                                      .OnSuccess(dsl => dsl.WithSelf(s => s.Siblings()).JQuery.Dom.Remove())
                                      .AsHtmlAttributes(classes: "flex-grow-1")
                                      .ToTag(HtmlTag.Div, this._grid.EmptyTemplate)
                                      .HtmlContentToString());
                    }
                }
            }

            return sb.ToString();
        }

        private TagBuilder RenderTHead()
        {
            var sb = new StringBuilder();

            var theadTag = new TagBuilder("thead");
            var tr = new TagBuilder("tr");

            foreach (var column in this._grid.Columns)
            {
                sb.Append(RenderTh(column).Result);
            }

            tr.InnerHtml.AppendHtml(sb.ToString());
            theadTag.InnerHtml.AppendHtml(tr.HtmlContentToString());
            return theadTag;
        }

        private TagBuilder RenderTBody()
        {
            var tbodyTag = new TagBuilder("tbody");

            var sb = new StringBuilder(DefaultBuilderCapacity);

            using (var stringHtml = new StringWrapperHtmlHelper(this._html, sb))
            {
                using (var template = this._html.Incoding().Template<TModel>())
                {
                    RenderRowsWithTemplate(template, sb);
                }
            }

            tbodyTag.InnerHtml.AppendHtml(sb.ToString());

            return tbodyTag;
        }

        private TagBuilder RenderTFoot()
        {
            var sb = new StringBuilder();

            var tfootTag = new TagBuilder("tfoot");
            var tr = new TagBuilder("tr");

            foreach (var column in this._grid.Columns)
            {
                var td = new TagBuilder("td");
                td.InnerHtml.AppendHtml("&nbsp;");
                sb.Append(td.HtmlContentToString());
            }

            tr.InnerHtml.AppendHtml(sb.ToString());
            tfootTag.InnerHtml.AppendHtml(tr.HtmlContentToString());
            return tfootTag;
        }

        private void RenderRowsWithTemplate(MvcTemplate<TModel> template, StringBuilder sb)
        {
            using (var each = string.IsNullOrWhiteSpace(this._grid.EachName)
                                      ? template.ForEach()
                                      : new TemplateHandlebarsSyntax<TModel>(this._html, this._grid.EachName, HandlebarsType.Each, string.Empty))
            {
                var tr = new TagBuilder("tr");

                tr.InnerHtml.AppendHtml(RenderRow(each));
                sb.Append(tr.HtmlContentToString());
            }
        }

        private string RenderRow(ITemplateSyntax<TModel> each)
        {
            var sb = new StringBuilder();

            foreach (var column in this._grid.Columns)
            {
                sb.Append(RenderTd(column, each));
            }

            return sb.ToString();
        }

        private async Task<string> RenderTh(Column<TModel> column)
        {

            return "";
        }

        private string RenderTd(Column<TModel> column, ITemplateSyntax<TModel> each)
        {
            var td = new TagBuilder("td");
            td.AddCssClass(column.CssClass);

            td.MergeAttributes(column.Attributes.ToDictionary(key => key.Key, val => val.Value.Invoke(each).HtmlContentToString()));

            td.InnerHtml.AppendHtml(column.Content.Invoke(each).HtmlContentToString());

            if (column.Value != null)
            {
                td.MergeAttribute("data-grid-value", column.Value.Invoke(each).HtmlContentToString());
            }

            AddSortAndFilterCss(td, column);

            return td.HtmlContentToString();
        }

        private void AddSortAndFilterCss(TagBuilder cell, Column<TModel> column)
        {
            if (column.Sortable)
            {
                cell.AddCssClass("order-column");
            }

            if (column.Filterable)
            {
                cell.AddCssClass("filter-column");
            }
        }
    }
}
