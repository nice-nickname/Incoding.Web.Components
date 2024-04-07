namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

#endregion

public class SplitGridRenderer<T>
{
    private readonly Grid<T> _grid;

    private readonly IHtmlHelper _html;

    public SplitGridRenderer(IHtmlHelper html, Grid<T> grid)
    {
        this._grid = grid;
        this._html = html;
    }

    public IHtmlContent Render(bool concurrent = false)
    {
        var tables = concurrent
                ? this._grid.Tables.AsParallel().Select(RenderTableToComponent).ToList()
                : this._grid.Tables.AsEnumerable().Select(RenderTableToComponent).ToList();


        var root = Root(tables);

        root.InnerHtml.AppendHtml(RenderEmpty());
        root.InnerHtml.AppendHtml(RenderSplitPanels(tables));

        return root;
    }

    private TagBuilder Root(List<TableComponent> tables)
    {
        var root = TagsFactory.Div();

        root.AddCssClass("grid-component " + this._grid.Css);

        root.Attributes["id"] = this._grid.Id;
        root.AppendStyle(CssStyling.Width, this._grid.Width);
        root.AppendStyle(CssStyling.Height, this._grid.Height);

        ImlBindingHelper.BindToTag(this._html, root, iml => Bind(tables, this._grid.Binds));

        root.Attributes.Merge(this._grid.Attr);

        return root;
    }

    private TagBuilder RenderEmpty()
    {
        var empty = TagsFactory.Div();
        empty.AddCssClass("grid-empty hidden");

        empty.InnerHtml.AppendHtml(this._grid.EmptyContent);

        return empty;
    }

    private TagBuilder RenderSplitPanels(List<TableComponent> tables)
    {
        var panel = TagsFactory.Div();
        panel.AddCssClass("grid-splitter");

        var splitDto = this._grid.Splits.ToJsonString();

        var incodingAttrs = this._html.When(JqueryBind.InitIncoding)
                                      .OnSuccess(dsl => dsl.Self().JQuery.Call("splitter", splitDto))
                                      .AsHtmlAttributes()
                                      .ToDictionary();

        foreach (var (attr, value) in incodingAttrs)
        {
            panel.Attributes[attr] = value.ToString();
        }

        var index = 0;
        foreach (var (table, splitter) in tables.Zip(this._grid.Splits))
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
        splitPanel.AddCssClass("splitter-pane");

        splitPanel.Attributes["data-split-panel"] = "true";

        return splitPanel;
    }

    private IHtmlContent RenderDivider()
    {
        var div = TagsFactory.Div();
        div.AddCssClass("splitter-divider");

        div.Attributes["data-divider"] = "true";

        div.InnerHtml.AppendHtml("&nbsp;");

        return div;
    }

    private TableComponent RenderTableToComponent(Table<T> table)
    {
        var renderer = new TableRenderer<T>(this._html, table);
        return renderer.RenderComponent();
    }

    private IIncodingMetaLanguageEventBuilderDsl Bind(List<TableComponent> tables, ImlBinding bindings)
    {
        var gridOptionsDto = new GridDto
        {
            Table = new TableOptionsDto
            {
                CascadeEvents = this._grid.UI.CascadeEvents,
                HighlightRows = this._grid.UI.HighlightRowsOnHover,
                PlaceholderRows = this._grid.UI.PlaceholderRows
            },

            Splitter = this._grid.Splits.Select(s => new SplitterDto
            {
                Min = s.MinWidth,
                Max = s.MaxWidth
            }).ToArray(),

            Structure = tables.Select(t => t.ToDto()).ToArray()
        };

        if (this._grid.InfiniteScroll != null)
        {
            gridOptionsDto.InfiniteScroll = true;
            gridOptionsDto.ScrollChunkSize = this._grid.InfiniteScroll.ChunkSize;
            gridOptionsDto.LoadingRowCount = this._grid.InfiniteScroll.LoadingRowsCount;
        }

        var options = JsonConvert.SerializeObject(gridOptionsDto, new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            DefaultValueHandling = DefaultValueHandling.Include
        });

        var initBinding = this._html.When(JqueryBind.InitIncoding)
                                    .OnSuccess(dsl => dsl.Self().JQuery.Call("splitGrid", options))
                                    .OnComplete(dsl => dsl.Self().Trigger.Invoke(Bindings.Grid.Init));

        if (bindings != null)
        {
            initBinding = bindings(initBinding);
        }

        if (this._grid.DataSource != null)
        {
            initBinding = this._grid.DataSource.Bind(initBinding);
        }

        return initBinding;
    }
}
