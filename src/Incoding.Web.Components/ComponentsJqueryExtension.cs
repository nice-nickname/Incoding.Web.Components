namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.MvcContrib;

    #endregion

    public static class ComponentsJqueryExtension
    {
        public static IExecutableSetting SetSelection(this IncodingMetaCallbackJqueryDsl dsl, int start = 0, int end = int.MaxValue)
        {
            return dsl.Call("setSelection", start, end);
        }
    }
}
