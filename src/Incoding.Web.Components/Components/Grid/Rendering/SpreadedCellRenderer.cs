namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using Incoding.Web.MvcContrib;

#endregion

public class SpreadedCellRenderer<T, TSpread> : ICellRenderer<T>
{
    private readonly List<ICellRenderer<TSpread>> _renderers;

    private readonly Expression<Func<T, IEnumerable<TSpread>>> _spreadedField;

    public SpreadedCellRenderer(
            Expression<Func<T, IEnumerable<TSpread>>> spreadedField,
            List<ICellRenderer<TSpread>> renderers)
    {
        this._renderers = renderers;
        this._spreadedField = spreadedField;
    }

    public void Render(ITemplateSyntax<T> template, TextWriter content)
    {
        using (var spreadEach = template.ForEach(this._spreadedField))
        {
            foreach (var cellRenderer in this._renderers)
            {
                cellRenderer.Render(spreadEach, content);
            }
        }
    }
}
