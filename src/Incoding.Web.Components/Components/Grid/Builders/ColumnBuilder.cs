namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;

    #endregion

    public class ColumnBuilder<T>
    {
        private readonly Cell<T> _cell;

        private readonly Column _column;

        public ColumnBuilder()
        {
            this._cell = new Cell<T>();
            this._column = new Column();

            this._cell.Column = this._column;
        }

        internal Column Column => this._column;

        internal Cell<T> Cell => this._cell;

        public ColumnBuilder<T> Css(string css)
        {
            this._column.Css = css;

            return this;
        }

        public ColumnBuilder<T> Width(int width)
        {
            this._column.Width = width;

            return this;
        }

        public ColumnBuilder<T> Title(string title)
        {
            this._column.Title = title;

            return this;
        }

        public ColumnBuilder<T> Field(Expression<Func<T, object>> fieldAccessor)
        {
            var fieldName = ExpressionHelper.GetFieldName(fieldAccessor);

            this._cell.Field = fieldName;

            if (string.IsNullOrWhiteSpace(this._column.Title))
            {
                this._column.Title = fieldName;
            }

            if (this.Cell.Content == null)
            {
                Content(tmpl => tmpl.For(fieldAccessor).ToString().ToMvcHtmlString());
            }

            return this;
        }

        public ColumnBuilder<T> Content(TemplateContent<T> contentLambda)
        {
            this._cell.Content = contentLambda;

            return this;
        }
    }
}
