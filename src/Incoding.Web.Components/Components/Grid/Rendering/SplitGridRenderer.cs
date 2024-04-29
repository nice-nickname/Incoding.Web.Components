namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.Components.Grid.Rendering;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

public class SplitGridRenderer<T>
{
    public Grid<T> Grid { get; }

    public IHtmlHelper Html { get; }

    public GridStyles.Stylings DefaultStyles { get; }

    public SplitGridRenderer(IHtmlHelper html, Grid<T> grid, GridStyles.Stylings styles)
    {
        this.Grid = grid;
        this.Html = html;
        this.DefaultStyles = styles;
    }

    public IHtmlContent Render(bool concurrent = false)
    {
        var tables = concurrent
                ? this.Grid.Tables.AsParallel().Select(RenderTableToComponent).ToList()
                : this.Grid.Tables.AsEnumerable().Select(RenderTableToComponent).ToList();


        var root = Root(tables);

        root.InnerHtml.AppendHtml(RenderEmpty());
        root.InnerHtml.AppendHtml(RenderSplitPanels(tables));

        return root;
    }

    private TagBuilder Root(List<TableComponent> tables)
    {
        var root = TagsFactory.Div();

        root.AddCssClass(this.DefaultStyles.GridCss);
        root.AddCssClass(this.Grid.Css);

        root.Attributes["id"] = this.Grid.Id;
        root.AppendStyle(CssStyling.Width, this.Grid.Width);
        root.AppendStyle(CssStyling.Height, this.Grid.Height);

        ImlBinder.BindToTag(this.Html, root, iml => Bind(tables, this.Grid.Binds));

        root.Attributes.Merge(this.Grid.Attr);

        return root;
    }

    private TagBuilder RenderEmpty()
    {
        var empty = TagsFactory.Div();
        empty.AddCssClass(DefaultStyles.EmptyContainerCss);

        empty.InnerHtml.AppendHtml(this.Grid.EmptyContent);

        return empty;
    }

    private TagBuilder RenderSplitPanels(List<TableComponent> tables)
    {
        var panel = TagsFactory.Div();
        panel.AddCssClass(DefaultStyles.SplitterCss);

        var splitDto = this.Grid.Splits.ToJsonString();

        var incodingAttrs = this.Html.When(JqueryBind.InitIncoding)
                                      .OnSuccess(dsl => dsl.Self().JQuery.Call("splitter", splitDto))
                                      .AsHtmlAttributes()
                                      .ToDictionary();

        foreach (var (attr, value) in incodingAttrs)
        {
            panel.Attributes[attr] = value.ToString();
        }

        var index = 0;
        foreach (var (table, splitter) in tables.Zip(this.Grid.Splits))
        {
            panel.InnerHtml.AppendHtml(RenderSplitPanel(table, splitter));

            if (++index < tables.Count)
            {
                panel.InnerHtml.AppendHtml(RenderDivider());
            }
        }

        return panel;
    }

    private IHtmlContent RenderSplitPanel(TableComponent table, Splitter splitter)
    {
        var splitPanel = TagsFactory.Div();

        splitPanel.InnerHtml.AppendHtml(table.LayoutHtml);
        splitPanel.AddCssClass(DefaultStyles.SplitterPanelCss);

        splitPanel.Attributes["data-split-panel"] = "true";

        return splitPanel;
    }

    private IHtmlContent RenderDivider()
    {
        var div = TagsFactory.Div();
        div.AddCssClass(DefaultStyles.SplitterDividerCss);

        div.Attributes["data-divider"] = "true";

        var i = TagsFactory.Tag(HtmlTag.I);

        i.AddCssClass(DefaultStyles.SplitterDividerIconCss);

        div.InnerHtml.AppendHtml(i);

        return div;
    }

    private TableComponent RenderTableToComponent(Table<T> table)
    {
        var renderer = new TableRenderer<T>(this.Html, table, this.DefaultStyles);
        return renderer.RenderComponent();
    }

    private IIncodingMetaLanguageEventBuilderDsl Bind(List<TableComponent> tables, ImlBinding bindings)
    {
        var gridOptionsDto = new GridDto
        {
            Table = new TableOptionsDto
            {
                HighlightRows = this.Grid.UI.HighlightRowsOnHover,
                PlaceholderRows = this.Grid.UI.PlaceholderRows,
                Mode = this.Grid.Mode,
                Zebra = this.Grid.UI.Zebra
            },

            Splitter = this.Grid.Splits.Select(s => new SplitterDto
            {
                Min = s.MinWidth,
                Max = s.MaxWidth
            }).ToArray(),

            Structure = tables.Select(t => t.ToDto()).ToArray()
        };

        if (this.Grid.InfiniteScroll != null)
        {
            gridOptionsDto.InfiniteScroll = true;
            gridOptionsDto.ScrollChunkSize = this.Grid.InfiniteScroll.ChunkSize;
            gridOptionsDto.LoadingRowCount = this.Grid.InfiniteScroll.LoadingRowsCount;
        }

        var options = JsonConvert.SerializeObject(gridOptionsDto, new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            DefaultValueHandling = DefaultValueHandling.Include
        });

        var initBinding = this.Html.When(JqueryBind.InitIncoding)
                                    .OnSuccess(dsl => dsl.Self().JQuery.Call("splitGrid", options))
                                    .OnComplete(dsl =>
                                    {
                                        dsl.Self().Trigger.Invoke(Bindings.Grid.Init);
                                        dsl.Self().Trigger.Invoke(Bindings.Grid.DataSourceInit);
                                    });

        if (bindings != null)
        {
            initBinding = bindings(initBinding);
        }

        if (this.Grid.DataSource != null)
        {
            initBinding = this.Grid.DataSource.Bind(initBinding);
        }

        return initBinding;
    }
}
