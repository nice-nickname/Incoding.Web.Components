namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.IO;
    using System.Text;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public sealed class StringifiedHtmlHelper : IDisposable
    {
        private readonly IHtmlHelper _html;

        private readonly TextWriter _originWriter;

        private readonly TextWriter _newWriter;

        public TextWriter CurrentWriter => this._newWriter;

        public StringifiedHtmlHelper(IHtmlHelper html, StringBuilder sb)
        {
            this._html = html;
            this._originWriter = html.ViewContext.Writer;

            this._newWriter = new StringWriter(sb);

            this._html.ViewContext.Writer = _newWriter;
        }

        public void Dispose()
        {
            this._html.ViewContext.Writer = this._originWriter;
        }
    }
}
