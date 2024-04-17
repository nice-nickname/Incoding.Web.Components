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
        var actualType = Nullable.GetUnderlyingType(propInfo.PropertyType) ?? propInfo.PropertyType;

        switch (Type.GetTypeCode(actualType))
        {
            case TypeCode.Byte:
            case TypeCode.SByte:
            case TypeCode.UInt16:
            case TypeCode.UInt32:
            case TypeCode.UInt64:
            case TypeCode.Int16:
            case TypeCode.Int32:
            case TypeCode.Int64:
            case TypeCode.Decimal:
            case TypeCode.Double:
            case TypeCode.Single:
                return ColumnType.Numeric;

            case TypeCode.DateTime:
                return ColumnType.Datetime;

            case TypeCode.Boolean:
                return ColumnType.Boolean;

            case TypeCode.String:
                return ColumnType.String;

            default:
                throw new InvalidOperationException($"type {actualType} cannot be mapped as column field");
        }
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
