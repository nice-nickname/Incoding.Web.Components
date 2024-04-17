namespace Incoding.Web.Components;

#region << Using >>

using Incoding.Web.MvcContrib;

#endregion

public delegate IIncodingMetaLanguageEventBuilderDsl ImlBinding(IIncodingMetaLanguageEventBuilderDsl dsl);

public delegate IIncodingMetaLanguageEventBuilderDsl ImlTemplateBinding<T>(IIncodingMetaLanguageEventBuilderDsl dsl, ITemplateSyntax<T> tmpl);
