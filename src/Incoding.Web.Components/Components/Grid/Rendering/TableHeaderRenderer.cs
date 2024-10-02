namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
#endregion

public class TableHeaderRenderer<T>
{
    public Table<T> Table { get; set; }

    public IHtmlHelper Html { get; set; }

    public GridStyles.Stylings DefaultStyles { get; set; }

    private readonly TagBuilder _header;

    public TableHeaderRenderer()
    {
        _header = TagsFactory.THead();
    }

    public IHtmlContent Render()
    {
        AppendColumns(Table.Columns);

        var stacked = Table.Columns.SelectMany(s => s.Columns).ToList();

        if (stacked.Any())
            AppendColumns(stacked);

        return _header;
    }

    private void AppendColumns(List<Column> columns)
    {
        var row = TagsFactory.Tr();
        row.Attributes["header-row"] = "true";

        foreach (var column in columns)
        {
            row.InnerHtml.AppendHtml(RenderColumn(column));
        }

        _header.InnerHtml.AppendHtml(row);
    }

    private IHtmlContent RenderColumn(Column column)
    {
        var cell = TagsFactory.Th();

        cell.AddCssClass(column.Css);
        cell.MergeAttributes(column.Attr);

        var isStacked = column.Columns.Any();

        bool shouldBindClick = true;
        if (!isStacked && column.Sortable)
        {
            cell.AddCssClass(DefaultStyles.HeaderCellOrderCss);
            cell.InnerHtml.AppendHtml(RenderSortButton(column));

            shouldBindClick = true;
        }

        cell.InnerHtml.Append(column.Title);

        if (!isStacked && column.Filterable)
        {
            cell.AddCssClass(DefaultStyles.HeaderCellFilterCss);
            cell.InnerHtml.AppendHtml(RenderFilterButton(column));

            shouldBindClick = true;
        }

        if (!isStacked && column.Resizable)
        {
            cell.AddCssClass(DefaultStyles.HeaderCellResizeCss);
            cell.InnerHtml.AppendHtml(RenderResizeButton(column));
        }

        cell.Attributes["rowspan"] = isStacked ? "1" : "2";
        cell.Attributes["colspan"] = isStacked ? column.Columns.Count.ToString() : "1";

        if (shouldBindClick)
        {
            BindClick(cell, column);
        }

        return cell;
    }

    private IHtmlContent RenderSortButton(Column column)
    {
        var button = TagsFactory.Button();
        button.Attributes["role"] = GlobalSelectors.Roles.Sort;
        button.AddCssClass(DefaultStyles.HeaderCellOrderButtonCss);

        if (column.SortedBy.HasValue)
        {
            button.Attributes["data-sort"] = column.SortedBy.ToStringLower();
        }

        return button;
    }

    private IHtmlContent RenderFilterButton(Column column)
    {
        var button = TagsFactory.Button();
        button.Attributes["role"] = GlobalSelectors.Roles.Filter;
        button.AddCssClass(DefaultStyles.HeaderCellFilterButtonCss);

        ImlBinder.BindToTag(Html,
                            button,
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

        return button;
    }

    private IHtmlContent RenderResizeButton(Column column)
    {
        var button = TagsFactory.Button();
        button.Attributes["role"] = GlobalSelectors.Roles.Resize;

        button.AddCssClass(DefaultStyles.HeaderCellResizeButtonCss);

        ImlBinder.BindToTag(Html, button, iml => iml.When(JqueryBind.MouseDown)
                                                    .StopPropagation()
                                                    .PreventDefault()
                                                    .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('table').startResize", column.Index))
                                                    .When(JqueryBind.Click)
                                                    .StopPropagation()
                                                    .PreventDefault());

        return button;
    }

    private void BindClick(TagBuilder tag, Column column)
    {
        ImlBinder.BindToTag(Html,
            tag,
            iml =>
            {
                if (column.Sortable)
                {
                    iml.When(JqueryBind.Click)
                        .StopPropagation()
                        .OnBegin(dsl => dsl.Break.If(() => Selector.Jquery.Self().Is(c => c.Class(B.Active))))
                        .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                            .JQuery.Call("data('table').sort", Selector.Jquery.Self().Attr("data-index")));
                }

                if (column.Filterable)
                {
                    iml.When("contextmenu")
                        .StopPropagation()
                        .PreventDefault()
                        .OnSuccess(dsl => dsl.WithSelf(s => s.Closest(HtmlTag.Table))
                                            .JQuery.Call("data('table').openFilter",
                                                            Selector.Jquery.Self().Attr("data-index")));
                }

                return iml;
            });
    }
}
