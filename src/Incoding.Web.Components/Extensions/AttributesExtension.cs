namespace Incoding.Web.Components.Grid;

using System;

#region << Using >>

using System.Linq;
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
