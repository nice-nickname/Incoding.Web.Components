namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Reflection;

#endregion

public static class PropertyExtensions
{
    public static ColumnType ToColumnType(this PropertyInfo property)
    {
        var actualType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

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
}
