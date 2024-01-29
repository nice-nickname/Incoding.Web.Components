namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Core.Block.IoC;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public class TemplateRenderer<T> : IDisposable
    {
        private readonly StringifiedHtmlHelper _htmlStub;

        private readonly ITemplateSyntax<T> _template;

        public TemplateRenderer(IHtmlHelper html)
        {
            var factory = IoCFactory.Instance.TryResolve<ITemplateFactory>();

            this._htmlStub = new StringifiedHtmlHelper(html);

            this._template = factory.ForEach<T>(html);
        }

        public IHtmlContent Render(TemplateContent<T> content)
        {
            return content(this._template);
        }

        public void Dispose()
        {
            this._htmlStub.Dispose();
        }
    }
}
