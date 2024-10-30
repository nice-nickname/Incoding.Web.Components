namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
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
        var header = new ColumnBuilder<T>(Html, _currentIndex) { Template = Template };
        stackedHeader(header);

        var columns = new ColumnListBuilder<T>(Html, _currentIndex) { Template = Template };
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

        var clb = new ColumnListBuilder<TSpread>(Html, _currentIndex) { Template = Template.ForEach(spreadField) };

        for (var i = 0; i < spreadCount; i++)
        {
            spreadColumns(clb, i);

            var addedColumns = clb.Columns.Skip(i);

            foreach (var column in addedColumns)
            {
                if (column.Stacked != null && column.Stacked.Count != 0)
                {
                    foreach (var stacked in column.Stacked)
                    {
                        SetSpreadColumn(stacked, spreadFieldName, i);
                    }
                }
                else
                {
                    SetSpreadColumn(column, spreadFieldName, i);
                }
            }
        }

        Columns.AddRange(clb.Columns);

        _currentIndex = clb._currentIndex;

        void SetSpreadColumn(Column column, string spreadField, int spreadIndex)
        {
            column.SpreadField = spreadField;
            column.SpreadIndex = spreadIndex;

            if (!string.IsNullOrWhiteSpace(column.Content))
            {
                var shouldRemoveUps = !Regex.IsMatch(column.Content, @"\.\d\.");

                while (Regex.IsMatch(column.Content, @"!-([^\./\d]*)-!"))
                    column.Content = Regex.Replace(column.Content, @"!-([^\./\d]*)-!", "!-" + $"{spreadField}.{spreadIndex}." + "$1-!");

                if (shouldRemoveUps)
                    column.Content = column.Content.Replace("../", string.Empty);
            }
        }
    }
}
