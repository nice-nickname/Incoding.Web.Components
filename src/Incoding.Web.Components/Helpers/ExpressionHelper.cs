namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Reflection;
    using Incoding.Web.Components.Grid;
    using Microsoft.AspNetCore.Mvc.Rendering;
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

    public static class ExpressionHelper
    {
        public static ColumnType GetColumnTypeFromField<T, U>(Expression<Func<T, U>> field)
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
                    throw new InvalidOperationException($"type {actualType} cannit be mapped as column field");
            }
        }

        public static string GetFieldName<T, U>(Expression<Func<T, U>> field)
        {
            var propInfo = GetPropertyInfoFromAccessor(field);

            var type = typeof(T);
            if (propInfo.ReflectedType != null && type != propInfo.ReflectedType && !type.IsSubclassOf(propInfo.ReflectedType))
            {
                throw new ArgumentException($"Expression '{field}' refers to a property that is not from type {type}.");
            }

            return propInfo.Name;
        }

        private static PropertyInfo GetPropertyInfoFromAccessor<T, U>(Expression<Func<T, U>> field)
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
}
