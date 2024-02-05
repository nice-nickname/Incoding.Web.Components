namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Incoding.Core.Extensions;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridRenderer<T>
    {
        private readonly Grid<T> _grid;

        private readonly IHtmlHelper _html;

        private readonly Func<ITemplateSyntax<T>> _template;

        public GridRenderer(IHtmlHelper html, Grid<T> grid, Func<ITemplateSyntax<T>> template = null)
        {
            this._html = html;
            this._grid = grid;
            this._template = template;
        }

        public IHtmlContent Render()
        {
            var table = new TagBuilder("table");
            table.AddCssClass(this._grid.Css);

            table.InnerHtml.AppendHtml(RenderHeader().HtmlContentToString());
            table.InnerHtml.AppendHtml(RenderBody(true).HtmlContentToString());
            table.InnerHtml.AppendHtml(RenderFooter().HtmlContentToString());

            return table;
        }

        public IHtmlContent RenderComponent()
        {
            var columns = this._grid.Cells.Select(s => new
                                                       {
                                                               s.Field,
                                                               s.Type
                                                       })
                              .ToArray()
                              .ToJsonString();

            var rowTemplate = RenderRowTemplate();
            
            rowTemplate = rowTemplate.Replace("{{", "!-").Replace("}}", "-!");

            var initBind = this._html.When(JqueryBind.InitIncoding)
                               .OnSuccess(dsl => dsl.Self().JQuery.Call("gridComponent", columns, rowTemplate))
                               .OnComplete(dsl => dsl.Self().Trigger.Invoke(IncodingGridBind.Init));

            var table = this._grid.Binding(initBind)
                            .AsHtmlAttributes(new
                                              {
                                                      @class = this._grid.Css,
                                                      style = "table-layout: fixed",
                                                      id = this._grid.Id
                                              })
                            .ToTag(HtmlTag.Table,
                                   RenderHeader().HtmlContentToString() +
                                   RenderBody(false).HtmlContentToString() +
                                   RenderFooter().HtmlContentToString());

            GridTemplatesStore.Global.Set(this._grid.Id, rowTemplate);

            return table;
        }

        private IHtmlContent RenderHeader()
        {
            var header = new TagBuilder("thead");

            var hasStacked = this._grid.Columns.Any(s => s.Columns.Any());

            if (this._grid.Columns.Any())
            {
                header.InnerHtml.AppendHtml(RenderHeaderRow(this._grid.Columns, hasStacked));
            }

            var stackedColumns = this._grid.Columns.SelectMany(s => s.Columns).ToList();
            if (stackedColumns.Any())
            {
                header.InnerHtml.AppendHtml(RenderHeaderRow(stackedColumns, false));
            }

            return header;
        }

        private IHtmlContent RenderHeaderRow(List<Column> columns, bool hasStacked)
        {
            var row = new TagBuilder("tr");

            foreach (var column in columns)
            {
                var isStacked = column.Columns.Any();

                var cell = new TagBuilder("th");

                cell.InnerHtml.AppendHtml(column.Title);

                if (hasStacked)
                {
                    cell.Attributes.Add("rowspan", isStacked ? "1" : "2");
                    cell.Attributes.Add("colspan", isStacked ? "2" : "1");
                }

                if (!isStacked && column.Width.HasValue)
                {
                    cell.Attributes.Add("style", $"width: {column.Width}px;");
                }
                else if (isStacked)
                {
                    cell.Attributes.Add("style", $"width: {column.Columns.Sum(s => s.Width)}px;");
                }

                row.InnerHtml.AppendHtml(cell);
            }

            return row;
        }

        private IHtmlContent RenderBody(bool includeTemplate)
        {
            var body = new TagBuilder("tbody");

            if (includeTemplate)
            {
                body.InnerHtml.AppendHtml(RenderRowTemplate());
            }

            return body;
        }

        private string RenderRowTemplate()
        {
            var content = StringBuilderHelper.Default;

            using (var _ = new StringifiedHtmlHelper(this._html, content))
            {
                if (this._template == null)
                {
                    using var template = this._html.Incoding().Template<T>();
                    using var each = template.ForEach();

                    AppendRowWithContent(each, _.CurrentWriter);
                }
                else
                {
                    using var each = this._template.Invoke();

                    AppendRowWithContent(each, _.CurrentWriter);
                }
            }

            return content.ToString();
        }

        private void AppendRowWithContent(ITemplateSyntax<T> tmpl, TextWriter contentWriter)
        {
            var row = new TagBuilder("tr");
            row.AddCssClass(this._grid.Row.Css);

            contentWriter.Write(row.RenderStartTag().ToHtmlString());

            foreach (var cellRenderer in this._grid.CellRenderers)
            {
                cellRenderer.Render(tmpl, contentWriter);
            }

            contentWriter.Write(row.RenderEndTag().ToHtmlString());

            if (this._grid.Nested != null)
            {
                this._grid.Nested.Render(tmpl, contentWriter);
            }
        }

        private IHtmlContent RenderFooter()
        {
            var footer = new TagBuilder("tfoot");

            var row = new TagBuilder("tr");

            foreach (var gridCell in this._grid.Cells)
            {
                var cell = new TagBuilder("td");

                row.InnerHtml.AppendHtml(cell);
            }

            footer.InnerHtml.AppendHtml(row);
            return footer;
        }

        public record PartialResult
        {
            public IHtmlContent RowTemplate { get; set; }

            public IHtmlContent TableHtml { get; set; }
        }
    }
}
