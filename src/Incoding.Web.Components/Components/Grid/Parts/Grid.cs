namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class Grid<T>
    {
        public Grid(string id)
        {
            this.Id = id;
        }

        public string Id { get; }

        public string Css { get; set; }

        public Row<T> Row { get; set; }

        public List<Column> Columns { get; set; }

        public List<Cell> Cells { get; set; }

        public List<ICellRenderer<T>> CellRenderers { get; set; }

        public Func<IIncodingMetaLanguageEventBuilderDsl, IIncodingMetaLanguageEventBuilderDsl> Binding { get; set; } = iml => iml.When("_")
                                                                                                                                    .OnSuccess(dsl => dsl.Self());
    }
}
