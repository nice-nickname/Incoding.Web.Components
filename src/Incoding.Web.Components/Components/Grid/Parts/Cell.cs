namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;
    using Newtonsoft.Json;

    #endregion

    public class Cell
    {
        public string Field { get; set; }

        public ColumnType Type { get; set; }

        public ColumnFormat Format { get; set; }

        public Column Column { get; set; }
    }

    public class Cell<T> : Cell
    {
        [JsonIgnore]
        public IDictionary<string, TemplateContent<T>> Attrs { get; } = new Dictionary<string, TemplateContent<T>>();

        [JsonIgnore]
        public TemplateContent<T> Content { get; set; }
    }
}
