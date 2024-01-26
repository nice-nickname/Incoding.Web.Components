namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Web.Extensions;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class GridBuilder<TModel>
    {
        private readonly Grid<TModel> _grid;

        private Action<ColumnBuilder<TModel>> _buildColumnsAction;

        public IHtmlHelper Html { get; }

        public GridBuilder(IHtmlHelper html, string eachName)
        {
            this.Html = html;

            this._grid = new Grid<TModel>(eachName);
        }
        
        public GridBuilder<TModel> Css(string css)
        {
            this._grid.CssClass = css;
            return this;
        }

        public GridBuilder<TModel> Columns(Action<ColumnBuilder<TModel>> builderAction)
        {
            this._buildColumnsAction = builderAction;
            return this;
        }

        public GridBuilder<TModel> Row(Action<RowBuilder<TModel>> buildRow)
        {
            var rowBuilder = new RowBuilder<TModel>(Html);
            buildRow(rowBuilder);

            this._grid.Row = rowBuilder.Row;
            return this;
        }
            
        public GridBuilder<TModel> Sortable(bool value = true)
        {
            this._grid.Sortable = value;
            return this;
        }

        public GridBuilder<TModel> Filterable(bool value = true)
        {
            this._grid.Filterable = value;
            return this;
        }

        public GridBuilder<TModel> Totalable(bool value = true)
        {
            this._grid.Totalable = value;
            return this;
        }

        public GridBuilder<TModel> Empty(IHtmlContent content)
        {
            this._grid.EmptyTemplate = content.HtmlContentToString();
            return this;
        }

        public HtmlString RenderTmpl()
        {
            var renderer = new GridTemplateRenderer<TModel>(this.Html, this._grid);

            var columnsBuilder = new ColumnBuilder<TModel>(this.Html, this._grid);
            this._buildColumnsAction(columnsBuilder);

            this._grid.Columns = columnsBuilder.Columns;

            return renderer.RenderTmpl();
        }
    }
}
