namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Linq;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridComponentRenderer<T>
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
            var root = Root();

            var tables = this._useConcurrentRender ? this._grid.Tables.AsParallel() : this._grid.Tables.AsEnumerable();

            var splits = tables.Select(this.RenderSplitPanel).ToList();

            var index = 0;
            foreach (var split in splits)
            {
                root.InnerHtml.AppendHtml(split);

                if (++index < splits.Count)
                {
                    root.InnerHtml.AppendHtml(RenderDivider());
                }
            }

            return root;
        }

        private TagBuilder Root()
        {
            var root = new TagBuilder("div");

            var initBinding = this._html.When(JqueryBind.InitIncoding)
                                        .OnSuccess(dsl => dsl.Self().JQuery.Call("initializeSplitGrid"))
                                        .OnComplete(dsl => dsl.Self().Trigger.Invoke(Bindings.Grid.Init));

            var incodingAttributes = this._grid.Binds(initBinding)
                                        .AsHtmlAttributes(new {
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

        private IHtmlContent RenderSplitPanel(Table<T> table)
        {
            var divContainer = new TagBuilder("div");

            var component = RenderTable(table);

            divContainer.InnerHtml.AppendHtml(component.LayoutHtml);
            divContainer.AddCssClass("splitter-panel");

            return divContainer;
        }

        private TableComponent RenderTable(Table<T> table)
        {
            var renderer = new TableRenderer<T>(this._html, table);
            return renderer.RenderComponent();
        }
    }
}
