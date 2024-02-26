namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;

    #endregion

    public class ColumnListBuilder<T>
    {
        public List<ICellRenderer<T>> CellRenderers { get; }

        public List<Cell> Cells { get; }

        public List<Column> Columns { get; }

        public ColumnListBuilder()
        {
            this.Columns = new List<Column>();
            this.Cells = new List<Cell>();
            this.CellRenderers = new List<ICellRenderer<T>>();
        }

        public ColumnBuilder<T> Add()
        {
            var columnBuilder = new ColumnBuilder<T>();

            this.Cells.Add(columnBuilder.Cell);
            this.Columns.Add(columnBuilder.Column);

            CellRenderers.Add(new SingleCellRenderer<T>(columnBuilder.Cell));

            return columnBuilder;
        }

        public void Stacked(Action<ColumnBuilder<T>> stackedBuilder, Action<ColumnListBuilder<T>> builderAction)
        {
            var stackedColumn = new ColumnBuilder<T>();
            stackedBuilder(stackedColumn);

            var columnsBuilder = new ColumnListBuilder<T>();
            builderAction(columnsBuilder);

            var column = stackedColumn.Column;
            column.Columns.AddRange(columnsBuilder.Columns);

            this.Columns.Add(column);
            this.Cells.AddRange(columnsBuilder.Cells);
            this.CellRenderers.AddRange(columnsBuilder.CellRenderers);
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
            foreach (var cell in clb.Cells)
            {
                cell.Field = $"{spreadField}[{columnIndex++}].{cell.Field}";
            }

            this.Columns.AddRange(clb.Columns);
            this.Cells.AddRange(clb.Cells);

            clb = new ColumnListBuilder<TSpread>();
            buildAction(clb, 0);
            this.CellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(field, clb.CellRenderers));
        }
    }
}
