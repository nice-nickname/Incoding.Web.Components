namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class TagBuilderExtension
{
    public static void AppendAttribute(this TagBuilder tag, string attr, string value)
    {
        if (!tag.Attributes.ContainsKey(attr))
        {
            tag.Attributes[attr] = string.Empty;
        }

        tag.Attributes[attr] += " " + value;
    }

    public static void AppendAttributes<TKey, TVal>(this TagBuilder tag, IDictionary<TKey, TVal> attrs)
    {
        foreach (var (key, value) in attrs)
        {
            tag.AppendAttribute(key.ToString(), value.ToString());
        }
    }
}
