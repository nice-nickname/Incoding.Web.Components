namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;

    #endregion

    public class ColumnListBuilder<T>
    {
        private readonly List<Column<T>> _columns;

        private readonly List<ColumnHeader> _headers;

        public ColumnListBuilder()
        {
            this._columns = new List<Column<T>>();
            this._headers = new List<ColumnHeader>();
        }

        public ColumnBuilder<T> Add()
        {
            var columnBuilder = new ColumnBuilder<T>();

            this._columns.Add(columnBuilder.Column);
            this._headers.Add(columnBuilder.Header);

            return columnBuilder;
        }

        public void Stacked(string stackedTitle, Action<ColumnListBuilder<T>> buildAction)
        {
            var builder = new ColumnListBuilder<T>();
            buildAction(builder);

            this._columns.AddRange(builder._columns);
            this._headers.Add(new ColumnHeader
            {
                Title = stackedTitle,
                Stacked = builder._headers
            });
        }

        public void Spreaded<U>(
            Expression<Func<T, IEnumerable<U>>> field,
            int columnsCount,
            Action<ColumnListBuilder<U>, int> buildAction)
        {
            var spreadProperty = ExpressionHelper.GetFieldName(field);

            // for (var i = 0; i < columnsCount; i++)
            // {
            //     var cb = new ColumnListBuilder<U>();
            //     buildAction(cb, i);

            //     cb._columns.ForEach(col =>
            //     {
            //         var currentProperty = col.Property;

            //         col.Property = $"{spreadProperty}[{i}].{currentProperty}";
            //     });

            //     this._columns.AddRange(cb._columns);
            //     this._headers.AddRange(cb._headers);
            // }
        }

        internal List<Column<T>> Columns => this._columns;

        internal List<ColumnHeader> Headers => this._headers;
    }
}
