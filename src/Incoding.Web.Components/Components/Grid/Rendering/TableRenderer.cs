namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
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

            var content = RenderHeader().HtmlContentToString() +
                          RenderBody(false).HtmlContentToString() +
                          RenderFooter().HtmlContentToString();

            rowTemplate = rowTemplate.Replace("{{", "!-").Replace("}}", "-!");

            // Должны передавать на js клиента следующие параметры:
            // Колонки с именами, поля для этих колонок, тип и формат темплейст собственной строки
            // Контент внутренней таблицы, темплейт внутренней строки колонки внутренней таблицы и тд рекурсивно от 2 до 4 уровней вложенности
            var initBind = this._html.When(JqueryBind.InitIncoding)
                                     .OnSuccess(dsl => dsl.Self().Trigger.Invoke(Bindings.Table.Init));

            var table = this._table.Binding(initBind)
                            .AsHtmlAttributes(new
                            {
                                @class = this._table.Css,
                                style = "table-layout: fixed",
                                id = this._table.Id
                            })
                            .ToTag(HtmlTag.Table, content);

            return new TableComponent
            {
                Columns = this._table.Cells,
                LayoutHtml = table,
                RowTemplate = rowTemplate,
                Nested = this._table.NestedTable,
                NestedField = this._table.NestedField
            };
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

        public TableDto ToDto()
        {
            var columnDtos = Columns.Select(s =>
            {
                return new ColumnDto(s.Column.Index, s.Field, s.Column.Title)
                {
                    Format = s.Format,
                    Type = s.Type,
                    SpreadField = s.SpreadField,
                    SpreadIndex = s.SpreadIndex
                };
            }).ToList();

            var dto = new TableDto(columnDtos, RowTemplate, LayoutHtml.HtmlContentToString())
            {
                NestedField = NestedField,
                NestedTable = Nested?.ToDto()
            };

            return dto;
        }
    }
}
