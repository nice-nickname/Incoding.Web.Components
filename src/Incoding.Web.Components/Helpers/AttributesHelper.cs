namespace Incoding.Web.Components;

#region << Using >>

using Microsoft.AspNetCore.Routing;

#endregion

public static class AttributesHelper
{
    public static RouteValueDictionary Merge(object dest, object source)
    {
        var merged = new RouteValueDictionary(dest);

        if (dest == null || source == null)
        {
            return merged;
        }

        foreach (var propertyInfo in source.GetType().GetProperties())
        {
            merged[propertyInfo.Name] = propertyInfo.GetValue(source);
        }

        return merged;
    }
}
