namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Row<T>
    {
        public IDictionary<string, TemplateContent<T>> Attributes { get; set; }

        public string CssClass { get; set; }

        public Row()
        {
            Attributes = new Dictionary<string, TemplateContent<T>>();
        }
    }
}
