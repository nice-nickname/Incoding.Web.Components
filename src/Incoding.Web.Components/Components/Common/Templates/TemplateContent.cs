namespace Incoding.Web.Components;

using System.Threading.Tasks;

#region << Using >>

using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;

#endregion

public delegate IHtmlContent TemplateContent<T>(ITemplateSyntax<T> tmpl);

public delegate Task<IHtmlContent> TemplateContentAsync<T>(ITemplateSyntax<T> tmpl);

