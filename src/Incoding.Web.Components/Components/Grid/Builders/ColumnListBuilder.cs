namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Incoding.Core;
using Incoding.Core.Block.Caching;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ColumnListBuilder<T>
{
    public ITemplateSyntax<T> Template { get; set; }

    public List<Column> Columns { get; }

    public IHtmlHelper Html { get; }

    private int _currentIndex { get; set; }

    public ColumnListBuilder(IHtmlHelper html, int startIndex = 0)
    {
        Html = html;

        Columns = new List<Column>();

        _currentIndex = startIndex;
    }

    public ColumnBuilder<T> Add()
    {
        var columnBuilder = new ColumnBuilder<T>(Html, _currentIndex++) { Template = Template };

        Columns.Add(columnBuilder.Column);

        return columnBuilder;
    }

    public void Stacked(Action<ColumnBuilder<T>> stackedHeader, Action<ColumnListBuilder<T>> stackedColumns)
    {
        var headerIndex = _currentIndex++;
        var header = new ColumnBuilder<T>(Html, headerIndex) { Template = Template };
        stackedHeader(header);

        var columns = new ColumnListBuilder<T>(Html, _currentIndex) { Template = Template };
        stackedColumns(columns);

        foreach (var stacked in columns.Columns)
            stacked.ParentIndex = headerIndex;

        header.Column.Stacked.AddRange(columns.Columns);

        Columns.Add(header.Column);

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

        var clb = new ColumnListBuilder<TSpread>(Html, _currentIndex) { Template = Template.ForEach(spreadField) };

        for (var i = 0; i < spreadCount; i++)
        {
            spreadColumns(clb, i);

            var addedCells = clb.Columns.Skip(i);

            foreach (var cell in addedCells)
            {
                if (cell.Stacked != null)
                {
                    foreach (var stacked in cell.Stacked)
                    {
                        stacked.SpreadField = spreadFieldName;
                        stacked.SpreadIndex = i;
                    }
                }
                else
                {
                    cell.SpreadField = spreadFieldName;
                    cell.SpreadIndex = i;
                }
            }
        }

        Columns.AddRange(clb.Columns);

        _currentIndex = clb._currentIndex;
    }
}
