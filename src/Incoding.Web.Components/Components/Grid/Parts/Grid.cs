namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class Grid<T>
    {
        public Grid(string id)
        {
            this.Id = id;
        }

        public string Id { get; }

        public string Css { get; set; }

        public Row<T> Row { get; set; } = new();

        public List<Column> Columns { get; set; } = new();

        public List<Cell> Cells { get; set; } = new();

        public List<ICellRenderer<T>> CellRenderers { get; set; } = new();

        public Func<IIncodingMetaLanguageEventBuilderDsl, IIncodingMetaLanguageEventBuilderDsl> Binding { get; set; } = iml => iml.When("_").OnSuccess(dsl => dsl.Self());

        public IGrid<T> Nested { get; set; }
    }

    public interface IGrid<T>
    {
        public void Render(ITemplateSyntax<T> template, TextWriter contentWriter);
    }

    public class NestedGridRenderer<T, U> : IGrid<T>
    {
        private readonly Grid<U> _grid;

        private readonly IHtmlHelper _html;

        private readonly Expression<Func<T, IEnumerable<U>>> _nestedField;

        public NestedGridRenderer(Grid<U> grid, IHtmlHelper html, Expression<Func<T, IEnumerable<U>>> nestedField)
        {
            this._grid = grid;
            this._html = html;
            this._nestedField = nestedField;
        }

        public void Render(ITemplateSyntax<T> template, TextWriter contentWriter)
        {
            var gridRenderer = new GridRenderer<U>(this._html, this._grid, () => template.ForEach(this._nestedField));

            contentWriter.Write(gridRenderer.Render().HtmlContentToString());
        }
    }
}
