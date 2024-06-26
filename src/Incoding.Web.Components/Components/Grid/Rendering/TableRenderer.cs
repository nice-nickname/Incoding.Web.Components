namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using System.IO;
using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class TableRenderer<T>
{
    public Table<T> Table { get; }

    public IHtmlHelper Html { get; }

    public GridStyles.Stylings DefaultStyles { get; }

    public TableRenderer(IHtmlHelper html, Table<T> table, GridStyles.Stylings styles = null)
    {
        this.Html = html;
        this.Table = table;
        this.DefaultStyles = styles;
    }

    public TableComponent RenderComponent()
    {
        var rowTemplate = RenderRowTemplate();
        var dropdownTemplate = RenderDropdownTemplate();

        var table = RootTable();

        return new TableComponent
        {
            Columns = this.Table.Cells,
            LayoutHtml = table,
            RowTemplate = rowTemplate,
            Nested = this.Table.NestedTable,
            NestedField = this.Table.NestedField,
            DropdownTemplate = dropdownTemplate
        };
    }

    private TagBuilder RootTable()
    {
        var table = TagsFactory.Table();

        table.AddCssClass(DefaultStyles.TableCss);
        table.AddCssClass(this.Table.Css);

        table.Attributes["id"] = this.Table.Id;
        table.AppendStyle("table-layout", this.Table.Layout.ToStringLower());

        if (this.Table.Binding != null)
        {
            ImlBinder.BindToTag(this.Html, table, this.Table.Binding);
        }

        table.Attributes.Merge(this.Table.Attr);

        table.InnerHtml.AppendHtml(RenderHeader());
        table.InnerHtml.AppendHtml(RenderBody(false));
        table.InnerHtml.AppendHtml(RenderFooter());

        return table;
    }

    private IHtmlContent RenderHeader()
    {
        var header = TagsFactory.THead();

        var hasStacked = this.Table.Columns.Any(s => s.Columns.Any());

        if (this.Table.Columns.Any())
        {
            header.InnerHtml.AppendHtml(RenderHeaderRow(this.Table.Columns, hasStacked));
        }

        var stackedColumns = this.Table.Columns.SelectMany(s => s.Columns).ToList();
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

            if (!isStacked && column.Sortable)
            {
                cell.InnerHtml.AppendHtml(RenderSortButton(column));

                ImlBinder.BindToTag(Html, cell, iml => iml.When(JqueryBind.Click)
                                                                 .StopPropagation()
                                                                 .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                                                                      .JQuery.Call("data('table').sort", Selector.Jquery.Self().Attr("data-index")))
                                          );
            }

            cell.InnerHtml.AppendHtml(column.Title);

            if (!isStacked && column.Filterable)
                cell.InnerHtml.AppendHtml(RenderFilterButton(column));

            if (hasStacked)
            {
                cell.Attributes["rowspan"] = isStacked ? "1" : "2";
                cell.Attributes["colspan"] = isStacked ? column.Columns.Count.ToString() : "1";
            }

            var width = isStacked ?
                column.Columns.Sum(s => s.Width) :
                column.Width.GetValueOrDefault(0);

            if (width != 0)
                cell.AppendStyle(CssStyling.Width, width + "px");

            row.InnerHtml.AppendHtml(cell);
        }

        return row;
    }

    private TagBuilder RenderSortButton(Column column)
    {
        var sortButton = TagsFactory.Button();
        sortButton.Attributes["role"] = "sort";
        sortButton.InnerHtml.Append("s");

        if (column.SortedBy.HasValue)
        {
            sortButton.Attributes["data-sort"] = column.SortedBy.ToStringLower();
        }

        return sortButton;
    }

    private IHtmlContent RenderFilterButton(Column column)
    {
        var filterButton = TagsFactory.Button();
        filterButton.Attributes["role"] = "filter";
        filterButton.InnerHtml.Append("f");

        ImlBinder.BindToTag(Html, filterButton, iml => iml.When(JqueryBind.Click)
                                                                 .StopPropagation()
                                                                 .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                                                                     .JQuery.Call("data('table').openFilter",
                                                                                        Selector.Jquery.Self().Closest(HtmlTag.Th).Attr("data-index")))
                                    );

        return filterButton;
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

        using (var _ = new StringifiedHtmlTemplateWrapper<T>(this.Html, content))
        {
            AppendRowWithContent(_.TemplateSyntax, _.ContentWriter);
        }

        return TemplateEncoder.Encode(content.ToString());
    }

    private void AppendRowWithContent(ITemplateSyntax<T> tmpl, TextWriter contentWriter)
    {
        var row = TagsFactory.Tr();

        row.AddCssClass(DefaultStyles.RowCss);
        row.AddCssClass(this.Table.Row.Css);

        row.Attributes["body-row"] = "true";

        if (this.Table.Row.Binding != null)
        {
            ImlBinder.BindToTag(this.Html, row, this.Table.Row.Binding, tmpl);
        }

        foreach (var (attr, tmplValue) in this.Table.Row.Attr)
        {
            row.Attributes.Add(attr, tmplValue(tmpl).HtmlContentToString());
        }

        contentWriter.Write(row.RenderStartTag().ToHtmlString());

        foreach (var cellRenderer in this.Table.CellRenderers)
        {
            cellRenderer.Render(tmpl, contentWriter);
        }

        contentWriter.Write(row.RenderEndTag().ToHtmlString());
    }

    private string RenderDropdownTemplate()
    {
        if (this.Table.Row.DropdownContent == null)
            return string.Empty;

        var content = StringBuilderHelper.Default;

        using (var _ = new StringifiedHtmlTemplateWrapper<T>(this.Html, content))
        {
            AppendDropdownTemplate(_.TemplateSyntax, _.ContentWriter);
        }

        return TemplateEncoder.Encode(content.ToString());
    }

    private void AppendDropdownTemplate(ITemplateSyntax<T> each, TextWriter contentWriter)
    {
        contentWriter.Write(this.Table.Row.DropdownContent(each).HtmlContentToString());
    }

    private IHtmlContent RenderFooter()
    {
        var footer = TagsFactory.TFooter();

        var row = TagsFactory.Tr();

        row.Attributes["footer-row"] = "true";

        foreach (var gridCell in this.Table.Cells)
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
                Totalable = s.Column.Totalable,
                Sortable = s.Column.Sortable,
                SortedBy = s.Column.SortedBy
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
