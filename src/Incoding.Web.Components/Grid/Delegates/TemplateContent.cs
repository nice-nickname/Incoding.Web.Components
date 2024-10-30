namespace Incoding.Web.Components;

#region << Using >>

using System.Threading.Tasks;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;

#endregion

public delegate IHtmlContent TemplateContent<T>(ITemplateSyntax<T> tmpl);

public delegate Task<IHtmlContent> TemplateContentAsync<T>(ITemplateSyntax<T> tmpl);

