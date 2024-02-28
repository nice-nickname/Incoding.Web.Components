namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class RowBuilder<T> where T : IRowData
    {
        public Row<T> Row { get; }

        public RowBuilder()
        {
            this.Row = new Row<T>();
            this.Row.Attr.Add("data-row-id", tmpl => tmpl.For("RowId"));
        }

        public RowBuilder<T> Css(string css, bool replace = false)
        {
            if (replace)
            {
                this.Row.Css = string.Empty;
            }

            this.Row.Css += " " + css;

            return this;
        }

        public RowBuilder<T> Attr(string attr, string value)
        {
            return Attr(attr, _ => value.ToHtmlString());
        }

        public RowBuilder<T> Attr(string attr, TemplateContent<T> value)
        {
            this.Row.Attr[attr] = value;

            return this;
        }
    }
}
