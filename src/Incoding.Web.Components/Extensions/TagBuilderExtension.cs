namespace Incoding.Web.Components.Grid;

using System;

#region << Using >>

using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public static class AttributesExtension
{
    public static T GetAttribute<T>(this Enum @enum) where T : Attribute
    {
        var type = @enum.GetType();

        var member = type.GetMember(@enum.ToString());

        if (member.Length == 0)
            return null;

        var attributes = member[0].GetCustomAttributes(typeof(T), false);
        return attributes.Any() ? (T)attributes[0] : null;
    }
}

public static class TagBuilderExtension
{
    public static void AppendStyle(this TagBuilder tag, CssStyling style, string value)
    {
        var styleKey = style.GetAttribute<DescriptionAttribute>().Description;

        var styleAttr = $"{styleKey}: {value};";

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
