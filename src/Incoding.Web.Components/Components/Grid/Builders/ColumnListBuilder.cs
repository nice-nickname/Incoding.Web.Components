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
        Columns = new List<Column>();
        Cells = new List<Cell>();
        CellRenderers = new List<ICellRenderer<T>>();

        _currentIndex = startIndex;
        Html = html;
    }

    public ColumnBuilder<T> Add()
    {
        var columnBuilder = new ColumnBuilder<T>(Html, _currentIndex++);

        var newCell = columnBuilder.Cell;

        Cells.Add(newCell);
        Columns.Add(columnBuilder.Column);

        CellRenderers.Add(new SingleCellRenderer<T>(newCell, Html));

        return columnBuilder;
    }

    public void Stacked(Action<ColumnBuilder<T>> stackedHeader, Action<ColumnListBuilder<T>> stackedColumns)
    {
        var headerIndex = _currentIndex++;
        var header = new ColumnBuilder<T>(Html, headerIndex);
        stackedHeader(header);

        var columns = new ColumnListBuilder<T>(Html, _currentIndex);
        stackedColumns(columns);

        foreach (var stacked in columns.Columns)
        {
            stacked.ParentIndex = headerIndex;
        }

        header.Column.Columns.AddRange(columns.Columns);

        Columns.Add(header.Column);
        Cells.AddRange(columns.Cells);
        CellRenderers.AddRange(columns.CellRenderers);

        _currentIndex = columns._currentIndex;
    }

    public void Spreaded<TSpread>(
            Expression<Func<T, IEnumerable<TSpread>>> spreadField,
            int spreadCount,
            Action<ColumnListBuilder<TSpread>, int> spreadColumns)
    {
        if (spreadCount <= 0)
            throw new ArgumentException("count should be positive number", nameof(spreadCount));

        var spreadFieldName = spreadField.GetMemberName();

        var clb = new ColumnListBuilder<TSpread>(Html, _currentIndex);

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

        Columns.AddRange(clb.Columns);
        Cells.AddRange(clb.Cells);
        CellRenderers.Add(new SpreadedCellRenderer<T, TSpread>(spreadField, spreadedCells));

        _currentIndex = clb._currentIndex;
    }

    public void AutoMap()
    {
        new ColumnAttributeMapper(this)
                .MapFromType();
    }

    public class ColumnAttributeMapper
    {
        private readonly List<ColumnAttribute> _columnAttributes;

        private readonly ColumnListBuilder<T> _columnBuilder;

        public ColumnAttributeMapper(ColumnListBuilder<T> columnBuilder)
        {
            _columnBuilder = columnBuilder;
            _columnAttributes = CachingFactory.Instance.Retrieve(nameof(T),
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
            foreach (var column in _columnAttributes.Where(col => string.IsNullOrWhiteSpace(col.Stacked)))
                _columnBuilder.Add().Map(column);

            foreach (var stacked in _columnAttributes.Where(col => !string.IsNullOrWhiteSpace(col.Stacked))
                                                     .GroupBy(col => col.Stacked))
            {
                _columnBuilder.Stacked(
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
