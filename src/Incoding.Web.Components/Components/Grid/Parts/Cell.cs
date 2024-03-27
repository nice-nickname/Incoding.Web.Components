namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Cell
    {
        public string Field { get; set; }

        public string SpreadField { get; set; }

        public int? SpreadIndex { get; set; }

        public ColumnType Type { get; set; }

        public ColumnFormat Format { get; set; }

        public Column Column { get; set; }

        /// <summary>
        /// When `true` indicates that this column is attached to field from data
        /// or it is custom column (like button, icon, expander)
        /// </summary>
        public bool IsValueColumn { get; set; }
    }

    public class Cell<T> : Cell
    {
        public IDictionary<string, TemplateContent<T>> Attrs { get; } = new Dictionary<string, TemplateContent<T>>();

        public TemplateContent<T> Content { get; set; }

        public ImlTemplateBinding<T> Binding { get; internal set; }
    }
}
