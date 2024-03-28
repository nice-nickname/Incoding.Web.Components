namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ColumnListBuilder<T>
{
    public List<ICellRenderer<T>> CellRenderers { get; }

    public List<Cell> Cells { get; }

    public List<Column> Columns { get; }

    public IHtmlHelper Html { get; }

    private int _currentIndex { get; set; }


    public ColumnListBuilder(IHtmlHelper html, int startIndex = 0)
    {
        this.Columns = new List<Column>();
        this.Cells = new List<Cell>();
        this.CellRenderers = new List<ICellRenderer<T>>();

        this._currentIndex = startIndex;
        this.Html = html;
    }

    public ColumnBuilder<T> Add()
    {
        var columnBuilder = new ColumnBuilder<T>(this.Html, this._currentIndex++);

        var newCell = columnBuilder.Cell;

        this.Cells.Add(newCell);
        this.Columns.Add(columnBuilder.Column);

        CellRenderers.Add(new SingleCellRenderer<T>(newCell, this.Html));

        return columnBuilder;
    }

    public void Stacked(Action<ColumnBuilder<T>> stackedBuilder, Action<ColumnListBuilder<T>> builderAction)
    {
        var stackedColumn = new ColumnBuilder<T>(this.Html);
        stackedBuilder(stackedColumn);

        var columnsBuilder = new ColumnListBuilder<T>(this.Html, this._currentIndex);
        builderAction(columnsBuilder);

        this._currentIndex = columnsBuilder._currentIndex;

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

        var clb = new ColumnListBuilder<TSpread>(this.Html, this._currentIndex);

        for (var i = 0; i < spreadCount; i++)
        {
            buildAction(clb, i);
        }

        this._currentIndex = clb._currentIndex;

        int columnIndex = 0;
        int spreadIndex = 0;
        int totalCellsPerSpread = clb.Cells.Count / spreadCount;

        foreach (var cell in clb.Cells)
        {
            cell.SpreadField = spreadField;
            cell.SpreadIndex = spreadIndex;

            if (++columnIndex % totalCellsPerSpread == 0)
            {
                spreadIndex++;
            }
        }

        this.Columns.AddRange(clb.Columns);
        this.Cells.AddRange(clb.Cells);

        clb = new ColumnListBuilder<TSpread>(this.Html);

        buildAction(clb, 0);
        this.CellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(field, clb.CellRenderers));
    }
}
