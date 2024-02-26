namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class Row<T>
    {
        public string Css { get; set; } = string.Empty;

        public TemplateContent<T> Id { get; set; }
    }
}
