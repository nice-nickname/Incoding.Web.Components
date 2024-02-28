namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class TableSplitBuilder<T> where T : IRowData
    {
        public List<Table<T>> Tables { get; }

        private readonly IHtmlHelper _html;

        public TableSplitBuilder(IHtmlHelper html)
        {
            this._html = html;
            this.Tables = new List<Table<T>>();
        }

        public void Add(string splitId, Action<TableBuilder<T>> buildAction)
        {
            var builder = new TableBuilder<T>(this._html, splitId);

            buildAction(builder);

            this.Tables.Add(builder.Table);
        }
    }
}
