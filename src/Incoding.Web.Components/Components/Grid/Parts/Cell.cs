namespace Incoding.Web.Components.Grid
{
    public class Cell
    {
        public string Field { get; set; }

        public ColumnType Type { get; set; }

        public Column Column { get; set; }
    }

    public class Cell<T> : Cell
    {
        public TemplateContent<T> Content { get; set; }
    }
}
