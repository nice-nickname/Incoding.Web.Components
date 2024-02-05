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
            using var ea = template.Is(ConvertLambda(this._nestedField));

            var row = new TagBuilder("tr");
            var cell = new TagBuilder("td");

            row.AddCssClass("hidden");
            row.AddCssClass("nested");

            cell.Attributes.Add("colspan", int.MaxValue.ToString());

            contentWriter.Write(row.RenderStartTag().ToHtmlString());
            contentWriter.Write(cell.RenderStartTag().ToHtmlString());

            var gridRenderer = new GridRenderer<U>(this._html, this._grid, () => template.ForEach(this._nestedField));
            contentWriter.Write(gridRenderer.Render().HtmlContentToString());

            contentWriter.Write(cell.RenderEndTag().ToHtmlString());
            contentWriter.Write(row.RenderEndTag().ToHtmlString());
        }

        public Expression<Func<T, object>> ConvertLambda(Expression<Func<T, IEnumerable<U>>> expression)
        {
            ParameterExpression parameter = expression.Parameters[0];

            UnaryExpression body = Expression.Convert(expression.Body, typeof(object));

            return Expression.Lambda<Func<T, object>>(body, parameter);
        }
    }
}
