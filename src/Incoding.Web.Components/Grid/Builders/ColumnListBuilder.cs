namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class ColumnListBuilder<T>
{
    public ITemplateSyntax<T> Template { get; set; }

    public int? SpreadIndex { get; set; } = null;

    public string SpreadField { get; set; } = null;

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
        var columnBuilder = new ColumnBuilder<T>(Html, _currentIndex++)
                            {
                                    Template = Template,
                            };

        if (SpreadField != null)
        {
            columnBuilder.Column.SpreadField = SpreadField;
            columnBuilder.Column.SpreadIndex = SpreadIndex;
        }

        Columns.Add(columnBuilder.Column);

        return columnBuilder;
    }

    public void Stacked(Action<ColumnBuilder<T>> stackedHeader, Action<ColumnListBuilder<T>> stackedColumns)
    {
        var header = new ColumnBuilder<T>(Html, _currentIndex) { Template = Template };
        stackedHeader(header);

        var columns = new ColumnListBuilder<T>(Html, _currentIndex)
                      {
                              Template = Template,
                              SpreadField = SpreadField,
                              SpreadIndex = SpreadIndex
                      };

        stackedColumns(columns);

        foreach (var stacked in columns.Columns)
            stacked.ParentUid = header.Column.Uid;

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

        for (var i = 0; i < spreadCount; i++)
        {
            var clb = new ColumnListBuilder<TSpread>(Html, _currentIndex)
                      {
                              Template = Template.ForEach(spreadField),
                              SpreadField = spreadFieldName,
                              SpreadIndex = i
                      };

            spreadColumns(clb, i);
            Columns.AddRange(clb.Columns);

            _currentIndex = clb._currentIndex;
        }
    }
}
