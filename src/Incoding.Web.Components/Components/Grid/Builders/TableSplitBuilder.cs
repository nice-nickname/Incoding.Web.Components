namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class TableSplitBuilder<T>
    {
        public List<Table<T>> Tables { get; }

        public List<Splitter> Splits { get; }

        private readonly IHtmlHelper _html;

        public TableSplitBuilder(IHtmlHelper html)
        {
            this._html = html;

            this.Tables = new List<Table<T>>();
            this.Splits = new List<Splitter>();
        }

        public SplitBuilder Add(string splitId, Action<TableBuilder<T>> buildAction)
        {
            var tableBuilder = new TableBuilder<T>(this._html, splitId);
            var splitBuilder = new SplitBuilder();

            buildAction(tableBuilder);

            this.Tables.Add(tableBuilder.Table);
            this.Splits.Add(splitBuilder.Splitter);

            return splitBuilder;
        }
    }
}
