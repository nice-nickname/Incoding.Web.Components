namespace Incoding.Web.Components.Grid;

using System;

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

public class TableRenderer<T>
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
        var dropdownTemplate = RenderDropdownTemplate();

        rowTemplate = rowTemplate.Replace("{{", "!-").Replace("}}", "-!");
        dropdownTemplate = dropdownTemplate.Replace("{{", "!-").Replace("}}", "-!");

        var table = RootTable();

        return new TableComponent
        {
            Columns = this._table.Cells,
            LayoutHtml = table,
            RowTemplate = rowTemplate,
            Nested = this._table.NestedTable,
            NestedField = this._table.NestedField,
            DropdownTemplate = dropdownTemplate
        };
    }

    private TagBuilder RootTable()
    {
        var table = TagsFactory.Table();

        var layout = this._table.Layout == LayoutType.Fixed ? "fixed" : "auto";

        table.AddCssClass(this._table.Css);

        table.Attributes["id"] = this._table.Id;
        table.AppendStyle("table-layout", this._table.Layout.ToStringLower());

        if (this._table.Binding != null)
        {
            ImlBindingHelper.BindToTag(this._html, table, this._table.Binding);
        }

        table.Attributes.Merge(this._table.Attr);

        table.InnerHtml.AppendHtml(RenderHeader());
        table.InnerHtml.AppendHtml(RenderBody(false));
        table.InnerHtml.AppendHtml(RenderFooter());

        return table;
    }

    private IHtmlContent RenderHeader()
    {
        var header = TagsFactory.THead();

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
        var row = TagsFactory.Tr();

        row.Attributes["header-row"] = "true";

        foreach (var column in columns)
        {
            var isStacked = column.Columns.Any();

            var cell = TagsFactory.Th();

            cell.MergeAttributes(column.Attr);

            cell.InnerHtml.AppendHtml(column.Title);

            if (hasStacked)
            {
                cell.Attributes["rowspan"] = isStacked ? "1" : "2";
                cell.Attributes["colspan"] = isStacked ? column.Columns.Count.ToString() : "1";
            }

            var width = isStacked
                ? column.Columns.Sum(s => s.Width)
                : column.Width.GetValueOrDefault(0);

            cell.AppendStyle(CssStyling.Width, width + "px");

            row.InnerHtml.AppendHtml(cell);
        }

        return row;
    }

    private IHtmlContent RenderBody(bool includeTemplate)
    {
        var body = TagsFactory.TBody();

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
        var row = TagsFactory.Tr();
        row.AddCssClass(this._table.Row.Css);

        row.Attributes["body-row"] = "true";

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

    private string RenderDropdownTemplate()
    {
        if (this._table.Row.DropdownContent == null)
            return string.Empty;

        var content = StringBuilderHelper.Default;

        using (var _ = new StringifiedHtmlHelper(this._html, content))
        {
            using var template = this._html.Incoding().Template<T>();
            using var each = template.ForEach();

            AppendDropdownTemplate(each, _.CurrentWriter);
        }

        return content.ToString();
    }

    private void AppendDropdownTemplate(ITemplateSyntax<T> each, TextWriter contentWriter)
    {
        contentWriter.Write(this._table.Row.DropdownContent(each).HtmlContentToString());
    }

    private IHtmlContent RenderFooter()
    {
        var footer = TagsFactory.TFooter();

        var row = TagsFactory.Tr();

        row.Attributes["footer-row"] = "true";

        foreach (var gridCell in this._table.Cells)
        {
            var cell = TagsFactory.Td();

            var cellContent = TagsFactory.Span();
            cellContent.InnerHtml.AppendHtml("&nbsp;");

            cell.MergeAttributes(gridCell.Column.FooterAttr);

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

    public string DropdownTemplate { get; set; }

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
            DropdownTmpl = DropdownTemplate,
            HasDropdown = !string.IsNullOrWhiteSpace(DropdownTemplate),
            LayoutTmpl = LayoutHtml.HtmlContentToString(),
            NestedField = NestedField,
            Nested = Nested?.ToDto()
        };

        return dto;
    }
}
