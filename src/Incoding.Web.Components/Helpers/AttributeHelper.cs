namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Core.Extensions;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
    #endregion

    public static class AttributeHelper
    {
        public static void AddOrAppend(this AttributeDictionary attrs, string key, string value)
        {
            attrs[key] = attrs.GetOrDefault(key, string.Empty) + " " + value;
        }
    }
}
