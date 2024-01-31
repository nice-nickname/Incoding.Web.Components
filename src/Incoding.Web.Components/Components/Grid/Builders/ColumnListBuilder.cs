namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Linq.Expressions;

    #endregion

    public class ColumnListBuilder<T>
    {
        private readonly List<ICellRenderer<T>> _cellRenderers;

        private readonly List<Cell> _cells;

        private readonly List<Column> _columns;

        public ColumnListBuilder()
        {
            this._columns = new List<Column>();
            this._cells = new List<Cell>();
            this._cellRenderers = new List<ICellRenderer<T>>();
        }

        internal List<ICellRenderer<T>> CellRenderers => this._cellRenderers;

        internal List<Cell> Cells => this._cells;

        internal List<Column> Columns => this._columns;

        public ColumnBuilder<T> Add()
        {
            var columnBuilder = new ColumnBuilder<T>();

            this._cells.Add(columnBuilder.Cell);
            this._columns.Add(columnBuilder.Column);

            _cellRenderers.Add(new SingleCellRenderer<T>(columnBuilder.Cell));

            return columnBuilder;
        }

        public void Stacked(Action<ColumnBuilder<T>> stackedBuilder, Action<ColumnListBuilder<T>> builderAction)
        {
            var stackedColumn = new ColumnBuilder<T>();
            stackedBuilder(stackedColumn);

            var columnsBuilder = new ColumnListBuilder<T>();
            builderAction(columnsBuilder);

            var column = stackedColumn.Column;
            column.Columns.AddRange(columnsBuilder._columns);

            this._columns.Add(column);
            this._cells.AddRange(columnsBuilder._cells);
            this._cellRenderers.AddRange(columnsBuilder._cellRenderers);
        }

        public void Spreaded<TSpread>(
                Expression<Func<T, IEnumerable<TSpread>>> field,
                int spreadCount,
                Action<ColumnListBuilder<TSpread>, int> buildAction)
        {
            if (spreadCount <= 0)
                throw new ArgumentException("count should be positive number", nameof(spreadCount));

            var spreadField = ExpressionHelper.GetFieldName(field);

            var clb = new ColumnListBuilder<TSpread>();

            for (var i = 0; i < spreadCount; i++)
            {
                buildAction(clb, i);
            }

            var columnIndex = 0;
            foreach (var cell in clb._cells)
            {
                cell.Field = $"{spreadField}[{columnIndex++}].{cell.Field}";
            }

            this._columns.AddRange(clb._columns);
            this._cells.AddRange(clb._cells);

            clb = new ColumnListBuilder<TSpread>();
            buildAction(clb, 0);
            this._cellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(field, clb._cellRenderers));
        }
    }
}
