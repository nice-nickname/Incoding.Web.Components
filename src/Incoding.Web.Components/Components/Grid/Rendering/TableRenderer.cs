namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Incoding.Core.Extensions;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class TableRenderer<T> where T : IRowData
    {
        private readonly Table<T> _table;

        private readonly IHtmlHelper _html;

        public TableRenderer(IHtmlHelper html, Table<T> table)
        {
            this._html = html;
            this._table = table;
        }

        public TableComponent RenderComponent()
        {
            var rowTemplate = RenderRowTemplate();

            rowTemplate = rowTemplate.Replace("{{", "!-").Replace("}}", "-!");


            var table = RootTable();

            return new TableComponent
            {
                Columns = this._table.Cells,
                LayoutHtml = table,
                RowTemplate = rowTemplate,
                Nested = this._table.NestedTable,
                NestedField = this._table.NestedField
            };
        }

        private TagBuilder RootTable()
        {
            var table = new TagBuilder("table");

            var layout = this._table.Layout == LayoutType.Fixed ? "fixed" : "auto";

            table.AddCssClass(this._table.Css);
            table.Attributes.Add("style", $"table-layout: {layout};");
            table.Attributes.Add("id", this._table.Id);

            if (this._table.Binding != null)
            {
                ImlBindingHelper.BindToTag(this._html, table, this._table.Binding);
            }

            foreach (var (key, value) in this._table.Attr)
            {
                table.Attributes.Add(key, value);
            }

            table.InnerHtml.AppendHtml(RenderHeader());
            table.InnerHtml.AppendHtml(RenderBody(false));
            table.InnerHtml.AppendHtml(RenderFooter());

            return table;
        }

        private IHtmlContent RenderHeader()
        {
            var header = new TagBuilder("thead");

            var hasStacked = this._table.Columns.Any(s => s.Columns.Any());

            if (this._table.Columns.Any())
            {
                header.InnerHtml.AppendHtml(RenderHeaderRow(this._table.Columns, hasStacked));
            }

            var stackedColumns = this._table.Columns.SelectMany(s => s.Columns).ToList();
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

                cell.MergeAttributes(column.Attr);

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
                using var template = this._html.Incoding().Template<T>();
                using var each = template.ForEach();

                AppendRowWithContent(each, _.CurrentWriter);
            }

            return content.ToString();
        }

        private void AppendRowWithContent(ITemplateSyntax<T> tmpl, TextWriter contentWriter)
        {
            var row = new TagBuilder("tr");
            row.AddCssClass(this._table.Row.Css);

            if (this._table.Row.Binding != null)
            {
                ImlBindingHelper.BindToTag(this._html, row, this._table.Row.Binding, tmpl);
            }

            foreach (var (attr, tmplValue) in this._table.Row.Attr)
            {
                row.Attributes.Add(attr, tmplValue(tmpl).HtmlContentToString());
            }

            contentWriter.Write(row.RenderStartTag().ToHtmlString());

            foreach (var cellRenderer in this._table.CellRenderers)
            {
                cellRenderer.Render(tmpl, contentWriter);
            }

            contentWriter.Write(row.RenderEndTag().ToHtmlString());
        }

        private IHtmlContent RenderFooter()
        {
            var footer = new TagBuilder("tfoot");

            var row = new TagBuilder("tr");

            foreach (var gridCell in this._table.Cells)
            {
                var cell = new TagBuilder("td");
                cell.MergeAttributes(gridCell.Column.Attr);

                var cellContent = new TagBuilder("span");
                cellContent.InnerHtml.AppendHtml("&nbsp;");

                cell.InnerHtml.AppendHtml(cellContent);

                row.InnerHtml.AppendHtml(cell);
            }

            footer.InnerHtml.AppendHtml(row);
            return footer;
        }
    }

    public class TableComponent
    {
        public IHtmlContent LayoutHtml { get; set; }

        public string RowTemplate { get; set; }

        public List<Cell> Columns { get; set; }

        public TableComponent Nested { get; set; }

        public string NestedField { get; set; }

        public GridStructureDto ToDto()
        {
            var columnDtos = Columns.Select(s =>
            {
                return new ColumnDto
                {
                    Index = s.Column.Index,
                    Field = s.Field,
                    Title = s.Column.Title,
                    Format = s.Format,
                    Type = s.Type,
                    SpreadField = s.SpreadField,
                    SpreadIndex = s.SpreadIndex,
                    Totalable = s.Column.Totalable
                };
            }).ToArray();

            var dto = new GridStructureDto
            {
                Columns = columnDtos,
                RowTmpl = RowTemplate,
                LayoutTmpl = LayoutHtml.HtmlContentToString(),
                NestedField = NestedField,
                Nested = Nested?.ToDto()
            };

            return dto;
        }
    }
}
