namespace Incoding.Web.Components;

#region << Using >>

using System;
using System.Linq.Expressions;
using System.Reflection;
using Incoding.Web.Components.Grid;

#endregion

public static class ExpressionHelper
{
    public static ColumnType GetColumnTypeFromField<T, TField>(Expression<Func<T, TField>> field)
    {
        var propInfo = GetPropertyInfoFromAccessor(field);

        return propInfo.ToColumnType();
    }

    private static PropertyInfo GetPropertyInfoFromAccessor<T, TField>(Expression<Func<T, TField>> field)
    {
        var member = field.Body as MemberExpression;

        if (member == null)
        {
            var unaryExpression = field.Body as UnaryExpression;

            if (unaryExpression == null)
            {
                throw new ArgumentException($"Expression '{field}' refers to a method, not a property.");
            }

            member = unaryExpression.Operand as MemberExpression;

            if (member == null)
            {
                throw new ArgumentException($"Expression '{field}' refers to a method, not a property.");
            }
        }

        var propInfo = member.Member as PropertyInfo;
        if (propInfo == null)
        {
            throw new ArgumentException($"Expression '{field}' refers to a field, not a property.");
        }

        return propInfo;
    }
}
