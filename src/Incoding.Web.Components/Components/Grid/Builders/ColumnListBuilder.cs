namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Incoding.Core.Block.Caching;
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

        header.Column.Columns.AddRange(columns.Columns);

        this.Columns.Add(header.Column);
        this.Cells.AddRange(columns.Cells);
        this.CellRenderers.AddRange(columns.CellRenderers);

        this._currentIndex = columns._currentIndex;
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

        this.Columns.AddRange(clb.Columns);
        this.Cells.AddRange(clb.Cells);
        this.CellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(spreadField, spreadedCells));

        this._currentIndex = clb._currentIndex;
    }

    public void AutoMap()
    {
        new ColumnAttributeMapper(this)
            .MapFromType();
    }

    public class ColumnAttributeMapper
    {
        private readonly ColumnListBuilder<T> _columnBuilder;

        private readonly List<ColumnAttribute> _columnAttributes;

        public ColumnAttributeMapper(ColumnListBuilder<T> columnBuilder)
        {
            this._columnBuilder = columnBuilder;
            this._columnAttributes = CachingFactory.Instance.Retrieve(nameof(T),
                () => typeof(T)
                            .GetProperties()
                            .Where(prop => prop.HasAttribute<ColumnAttribute>())
                            .Select(prop =>
                            {
                                var columnAttr = prop.GetCustomAttribute<ColumnAttribute>();

                                columnAttr.Field = prop.Name;
                                columnAttr.Type = prop.ToColumnType();

                                columnAttr.Format = columnAttr.Format;

                                return columnAttr;
                            })
                            .ToList());
        }

        public void MapFromType()
        {
            foreach (var column in this._columnAttributes.Where(col => string.IsNullOrWhiteSpace(col.Stacked)))
                this._columnBuilder.Add().Map(column);

            foreach (var stacked in this._columnAttributes.Where(col => !string.IsNullOrWhiteSpace(col.Stacked))
                                                          .GroupBy(col => col.Stacked))
            {
                this._columnBuilder.Stacked(
                    stackedColumn => stackedColumn.Title(stacked.Key),
                    columnsList =>
                    {
                        foreach (var column in stacked.ToList())
                            columnsList.Add().Map(column);
                    });
            }
        }
    }
}
