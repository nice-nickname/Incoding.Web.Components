namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.IO;
    using System.Text;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class StringWrapperHtmlHelper : IDisposable
    {
        private readonly IHtmlHelper _helper;

        private readonly TextWriter _originWriter;

        public StringWrapperHtmlHelper(IHtmlHelper html, StringBuilder sb)
        {
            this._helper = html;
            this._originWriter = html.ViewContext.Writer;

            this._helper.ViewContext.Writer = new StringWriter(sb);
        }

        public void Dispose()
        {
            this._helper.ViewContext.Writer = this._originWriter;
        }
    }
}
