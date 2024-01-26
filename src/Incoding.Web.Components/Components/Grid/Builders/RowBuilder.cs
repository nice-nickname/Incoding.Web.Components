namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.Extensions;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class RowBuilder<T>
    {
        private readonly Row<T> _row;

        public RowBuilder(IHtmlHelper html)
        {
            Html = html;

            this._row = new Row<T>();
        }

        public IHtmlHelper Html { get; }

        public Row<T> Row => this._row;

        public RowBuilder<T> Css(string css)
        {
            this._row.CssClass = css;
            return this;
        }

        public RowBuilder<T> Attr(string attribute, string value)
        {
            return this.Attr(attribute, tmpl => value.ToMvcHtmlString());
        }

        public RowBuilder<T> Attr(string attribute, TemplateContent<T> value)
        {
            if (this._row.Attributes.ContainsKey(attribute))
            {
                this._row.Attributes[attribute] = value;
            }
            else
            {
                this._row.Attributes.Add(attribute, value);
            }

            return this;
        }
    }
}
