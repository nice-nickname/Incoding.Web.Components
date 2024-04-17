namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
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

    public void Stacked(Action<ColumnBuilder<T>> stackedHeader, Action<ColumnListBuilder<T>> stackedColumns)
    {
        var header = new ColumnBuilder<T>(this.Html);
        stackedHeader(header);

        var columns = new ColumnListBuilder<T>(this.Html, this._currentIndex);
        stackedColumns(columns);

        this._currentIndex = columns._currentIndex;

        header.Column.Columns.AddRange(columns.Columns);

        this.Columns.Add(header.Column);
        this.Cells.AddRange(columns.Cells);
        this.CellRenderers.AddRange(columns.CellRenderers);
    }

    public void Spreaded<TSpread>(
            Expression<Func<T, IEnumerable<TSpread>>> spreadField,
            int spreadCount,
            Action<ColumnListBuilder<TSpread>, int> spreadColumns)
    {
        if (spreadCount <= 0)
            throw new ArgumentException("count should be positive number", nameof(spreadCount));

        var spreadFieldName = spreadField.GetMemberName();

        var clb = new ColumnListBuilder<TSpread>(this.Html, this._currentIndex);

        var currentColumn = 0;
        var spreadedCells = new List<ICellRenderer<TSpread>>();

        for (var i = 0; i < spreadCount; i++)
        {
            spreadColumns(clb, i);

            var addedCells = clb.Cells.Skip(currentColumn);

            foreach (var cell in addedCells)
            {
                cell.SpreadField = spreadFieldName;
                cell.SpreadIndex = i;

                currentColumn++;
            }

            if (i == 0)
                spreadedCells.AddRange(clb.CellRenderers);
        }

        this._currentIndex = clb._currentIndex;

        this.Columns.AddRange(clb.Columns);
        this.Cells.AddRange(clb.Cells);
        this.CellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(spreadField, spreadedCells));
    }
}
