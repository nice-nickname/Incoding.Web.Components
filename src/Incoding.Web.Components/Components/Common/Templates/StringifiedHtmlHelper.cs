namespace Incoding.Web.Components
{
    #region << Using >>

    using System.IO;
    using System.Text;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class StringifiedHtmlHelper
    {
        private readonly IHtmlHelper _html;

        private readonly TextWriter _originWriter;

        public StringifiedHtmlHelper(IHtmlHelper html)
        {
            this._html = html;
            this._originWriter = html.ViewContext.Writer;

            this._html.ViewContext.Writer = new StringWriter(new StringBuilder());
        }

        public void Dispose()
        {
            this._html.ViewContext.Writer = this._originWriter;
        }
    }
}
