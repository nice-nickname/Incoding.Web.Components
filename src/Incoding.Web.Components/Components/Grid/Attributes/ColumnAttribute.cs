namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Web.Components.Grid;

    #endregion

    [AttributeUsage(AttributeTargets.Property)]
    public class ColumnAttribute : Attribute
    {
        public string Title { get; set; }

        public ColumnType Type { get; set; }

        public ColumnFormat Format { get; set; }
    }
}
