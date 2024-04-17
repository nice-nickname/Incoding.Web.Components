namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.Collections.Generic;
using System.ComponentModel;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class TagBuilderExtension
{
    public static void AppendStyle(this TagBuilder tag, CssStyling style, string value)
    {
        var styleKey = style.GetAttribute<DescriptionAttribute>()?.Description;

        styleKey ??= style.ToStringLower();

        tag.AppendStyle(styleKey, value);
    }

    public static void AppendStyle(this TagBuilder tag, string style, string value)
    {
        var styleAttr = $"{style}: {value};";

        tag.AppendAttribute(HtmlAttribute.Style.ToStringLower(), styleAttr);
    }

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
