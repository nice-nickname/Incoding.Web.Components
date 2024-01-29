namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;

    #endregion

    public class ColumnBuilder<T>
    {
        private readonly Column<T> _column;

        private readonly ColumnHeader _header;

        public ColumnBuilder()
        {
            _header = new ColumnHeader();
            _column = new Column<T>
            {
                Type = ColumnType.String
            };
        }

        public ColumnBuilder<T> Prop(Expression<Func<T, object>> expr)
        {
            var propertyName = ExpressionHelper.GetFieldName(expr);

            this._column.Property = propertyName;
            if (string.IsNullOrWhiteSpace(this._column.Title))
            {
                this._column.Title = propertyName;
                this._header.Title = propertyName;
            }

            return this;
        }

        public ColumnBuilder<T> Title(string title)
        {
            this._column.Title = title;
            this._header.Title = title;

            return this;
        }

        public ColumnBuilder<T> Type(ColumnType type)
        {
            this._column.Type = type;

            return this;
        }

        public ColumnBuilder<T> Css(string css)
        {
            this._column.Css = css;

            return this;
        }

        public ColumnBuilder<T> Content(TemplateContent<T> content)
        {
            this._column.Content = content;

            return this;
        }

        internal Column<T> Column => this._column;

        internal ColumnHeader Header => this._header;
    }
}
