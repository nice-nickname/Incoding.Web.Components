namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using System.Linq;
    using Incoding.Core.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridComponentRenderer<T> where T : IRowData
    {
        private readonly Grid<T> _grid;

        private readonly IHtmlHelper _html;

        private readonly bool _useConcurrentRender;

        public GridComponentRenderer(IHtmlHelper html, Grid<T> grid, bool useConcurrentRender)
        {
            this._grid = grid;
            this._html = html;
            this._useConcurrentRender = useConcurrentRender;
        }

        public IHtmlContent Render()
        {
            var tables = this._useConcurrentRender
                    ? this._grid.Tables.AsParallel().Select(RenderTable).ToList()
                    : this._grid.Tables.AsEnumerable().Select(RenderTable).ToList();


            var root = Root(tables);

            var index = 0;
            foreach (var table in tables)
            {
                root.InnerHtml.AppendHtml(RenderSplitPanel(table));

                if (++index < tables.Count)
                {
                    root.InnerHtml.AppendHtml(RenderDivider());
                }
            }

            return root;
        }

        private TagBuilder Root(List<TableComponent> tables)
        {
            var root = new TagBuilder("div");

            var initBinding = Bind(tables);

            var incodingAttributes = this._grid.Binds(initBinding)
                                        .AsHtmlAttributes(new
                                        {
                                            @class = "grid-splitter-container",
                                            id = this._grid.Id
                                        })
                                        .ToDictionary();

            foreach (var (key, value) in incodingAttributes)
            {
                root.Attributes.Add(key, value.ToString());
            }

            return root;
        }

        private IHtmlContent RenderDivider()
        {
            var div = new TagBuilder("div");
            div.AddCssClass("splitter-divider");

            div.InnerHtml.AppendHtml("&nbsp;");

            return div;
        }

        private IHtmlContent RenderSplitPanel(TableComponent table)
        {
            var divContainer = new TagBuilder("div");

            divContainer.InnerHtml.AppendHtml(table.LayoutHtml);
            divContainer.AddCssClass("splitter-panel");

            return divContainer;
        }

        private TableComponent RenderTable(Table<T> table)
        {
            var renderer = new TableRenderer<T>(this._html, table);
            return renderer.RenderComponent();
        }

        private IIncodingMetaLanguageEventBuilderDsl Bind(List<TableComponent> tables)
        {
            bool infinteScrolling = this._grid.Websocket.Enabled;

            var tableDtos = tables.Select(t => t.ToDto()).ToList();

            var gridOptionsDto = new GridOptionsDto
            {
                Scroll = this._grid.InfiniteScroll,
                Websocket = this._grid.Websocket,
                UI=  this._grid.UI,
            };

            var initBinding = this._html.When(JqueryBind.InitIncoding)
                                        .OnSuccess(dsl =>
                                        {
                                            dsl.Self().JQuery.Call("splitGrid", tableDtos.ToJsonString(), gridOptionsDto.ToJsonString());

                                            if (infinteScrolling)
                                            {
                                                var chunkSize = this._grid.Websocket.ChunkSize;

                                                dsl.Self().JQuery.PlugIn("websocketLoader", new
                                                {
                                                    chunkSize = chunkSize,
                                                    method = this._grid.Websocket.Method
                                                });
                                            }
                                        })
                                        .OnComplete(dsl => dsl.Self().Trigger.Invoke(Bindings.Grid.Init));

            return initBinding;
        }
    }
}
