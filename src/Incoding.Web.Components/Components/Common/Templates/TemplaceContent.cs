namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;

    #endregion

    public delegate IHtmlContent TemplateContent<T>(ITemplateSyntax<T> tmpl);

    public delegate IIncodingMetaLanguageEventBuilderDsl ImlBinding(IIncodingMetaLanguageEventBuilderDsl dsl);

    public delegate IIncodingMetaLanguageEventBuilderDsl ImlTemplateBinding<T>(IIncodingMetaLanguageEventBuilderDsl dsl, ITemplateSyntax<T> tmpl);
}
