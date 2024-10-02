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
        Html = html;
        Table = table;
        DefaultStyles = styles;
    }

    public TableComponent RenderComponent()
    {
        var rowTemplate = RenderRowTemplate();
        var dropdownTemplate = RenderDropdownTemplate();

        var table = RootTable();

        return new TableComponent
        {
            Columns = Table.Cells,
            LayoutHtml = table,
            RowTemplate = rowTemplate,
            Nested = Table.NestedTable,
            NestedField = Table.NestedField,
            DropdownTemplate = dropdownTemplate
        };
    }

    private TagBuilder RootTable()
    {
        var table = TagsFactory.Table();

        table.AddCssClass(DefaultStyles.TableCss);
        table.AddCssClass(Table.Css);

        table.Attributes[HtmlAttribute.Id.ToStringLower()] = Table.Id;
        table.Attributes["role"] = GlobalSelectors.Roles.Table;

        table.AppendStyle("table-layout", Table.Layout.ToStringLower());

        if (Table.Binding != null)
        {
            ImlBinder.BindToTag(Html, table, Table.Binding);
        }

        table.Attributes.Merge(Table.Attr);

        table.InnerHtml.AppendHtml(RenderHeader());
        table.InnerHtml.AppendHtml(RenderBody(false));
        table.InnerHtml.AppendHtml(RenderFooter());

        return table;
    }

    private IHtmlContent RenderHeader()
    {
        var renderer = new TableHeaderRenderer<T>
        {
            DefaultStyles = DefaultStyles,
            Html = Html,
            Table = Table
        };

        return renderer.Render();
    }


    private TagBuilder RenderSortButton(Column column)
    {
        var sortButton = TagsFactory.Button();
        sortButton.Attributes["role"] = GlobalSelectors.Roles.Sort;
        sortButton.AddCssClass(DefaultStyles.HeaderCellOrderButtonCss);

        if (column.SortedBy.HasValue)
        {
            sortButton.Attributes["data-sort"] = column.SortedBy.ToStringLower();
        }

        return sortButton;
    }

    private IHtmlContent RenderFilterButton(Column column)
    {
        var filterButton = TagsFactory.Button();
        filterButton.Attributes["role"] = GlobalSelectors.Roles.Filter;
        filterButton.AddCssClass(DefaultStyles.HeaderCellFilterButtonCss);

        ImlBinder.BindToTag(Html,
                            filterButton,
                            iml => iml.When(JqueryBind.Click)
                                      .StopPropagation()
                                      .OnSuccess(dsl =>
                                                 {
                                                     dsl.Self().JQuery.ToggleAttribute("data-opened", "true", "false");

                                                     dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                                        .JQuery.Call("data('table').openFilter",
                                                                     Selector.Jquery.Self().Closest(HtmlTag.Th).Attr("data-index"))
                                                        .If(() => Selector.Jquery.Self().Attr("data-opened") == "true");

                                                     dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                                        .JQuery.Call("data('table').closeFilter")
                                                        .If(() => Selector.Jquery.Self().Attr("data-opened") == "false");
                                                 })
                           );

        return filterButton;
    }

    private IHtmlContent RenderResizer(Column column)
    {
        var resizer = TagsFactory.Button();
        resizer.Attributes["role"] = GlobalSelectors.Roles.Resize;

        resizer.AddCssClass(DefaultStyles.HeaderCellResizeButtonCss);

        ImlBinder.BindToTag(Html, resizer, iml => iml.When(JqueryBind.MouseDown)
                                                     .StopPropagation()
                                                     .PreventDefault()
                                                     .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('table').startResize", column.Index))
                                                     .When(JqueryBind.Click)
                                                     .StopPropagation()
                                                     .PreventDefault());

        return resizer;
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

        using (var _ = new StringifiedHtmlHelperWrapper<T>(Html, content))
        {
            AppendRowWithContent(_.TemplateSyntax, _.ContentWriter);
        }

        return TemplateEncoder.Encode(content.ToString());
    }

    private void AppendRowWithContent(ITemplateSyntax<T> tmpl, TextWriter contentWriter)
    {
        var row = TagsFactory.Tr();

        row.AddCssClass(DefaultStyles.RowCss);
        row.AddCssClass(Table.Row.Css);
        row.Attributes["role"] = GlobalSelectors.Roles.Row;

        row.Attributes["body-row"] = "true";

        if (Table.Row.Binding != null)
        {
            ImlBinder.BindToTag(Html, row, Table.Row.Binding, tmpl);
        }

        foreach (var (attr, tmplValue) in Table.Row.Attr)
        {
            row.Attributes.Add(attr, tmplValue(tmpl).HtmlContentToString());
        }

        contentWriter.Write(row.RenderStartTag().ToHtmlString());

        foreach (var cellRenderer in Table.CellRenderers)
        {
            cellRenderer.Render(tmpl, contentWriter);
        }

        contentWriter.Write(row.RenderEndTag().ToHtmlString());
    }

    private string RenderDropdownTemplate()
    {
        if (Table.Row.DropdownContent == null)
            return string.Empty;

        var content = StringBuilderHelper.Default;

        using (var _ = new StringifiedHtmlHelperWrapper<T>(Html, content))
        {
            AppendDropdownTemplate(_.TemplateSyntax, _.ContentWriter);
        }

        return TemplateEncoder.Encode(content.ToString());
    }

    private void AppendDropdownTemplate(ITemplateSyntax<T> each, TextWriter contentWriter)
    {
        contentWriter.Write(Table.Row.DropdownContent(each).HtmlContentToString());
    }

    private IHtmlContent RenderFooter()
    {
        var footer = TagsFactory.TFooter();

        var row = TagsFactory.Tr();

        row.Attributes["footer-row"] = "true";

        foreach (var gridCell in Table.Cells)
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
        var columnDtos = Columns
            .Select(s => new ColumnDto
            {
                Id = s.Column.Id,
                Index = s.Column.Index,
                Field = s.Field,
                Title = s.Column.Title,
                Format = s.Format,
                Type = s.Type,
                SpreadField = s.SpreadField,
                SpreadIndex = s.SpreadIndex,
                Totalable = s.Column.Totalable,
                Sortable = s.Column.Sortable,
                SortedBy = s.Column.SortedBy,
                ParentIndex = s.Column.ParentIndex,
                Width = s.Column.Width
            })
            .ToArray();

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
