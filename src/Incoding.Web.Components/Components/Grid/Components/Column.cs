namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Collections.Generic;
    using Incoding.Core.Extensions;

    #endregion

    public interface IColumn
    {
        int Index { get; set; }

        string Title { get; }

        string CssClass { get; }

        bool Totalable { get; }

        bool Sortable { get; }

        bool Filterable { get; }

        ColumnType Type { get; }
    }

    public class Column<T> : IColumn
    {
        public int Index { get; set; }

        public string Title { get; set; }

        public string CssClass { get; set; }

        public ColumnType Type { get; set; }

        public TemplateContent<T> Content { get; set; }

        public TemplateContent<T> Value { get; set; }

        public bool Totalable { get; set; }

        public bool Sortable { get; set; }

        public bool Filterable { get; set; }

        public IDictionary<string, TemplateContent<T>> Attributes { get; set; }

        public Column(int index = 0)
        {
            Attributes = new Dictionary<string, TemplateContent<T>>();

            this.Type = ColumnType.Plain;
            this.Index = index;  
        }

        public bool IsNumericColumn => Type.IsAnyEquals(ColumnType.Currency, ColumnType.Numeric);

        public bool IsTemplateColumn => Type == ColumnType.Template;
    }
}
