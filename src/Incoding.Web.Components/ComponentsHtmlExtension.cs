namespace Incoding.Web.Components
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public static class ComponentsHtmlExtension
    {
        public static ComponentsHtmlHelper Components(this IHtmlHelper html)
        {
            return new ComponentsHtmlHelper(html);
        }
    }
}
