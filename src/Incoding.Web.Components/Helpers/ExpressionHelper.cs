namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;
    using System.Reflection;

    #endregion

    public static class ExpressionHelper
    {
        public static string GetFieldName<T, U>(Expression<Func<T, U>> field)
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

            var type = typeof(T);
            if (propInfo.ReflectedType != null && type != propInfo.ReflectedType && !type.IsSubclassOf(propInfo.ReflectedType))
            {
                throw new ArgumentException($"Expression '{field}' refers to a property that is not from type {type}.");
            }

            return propInfo.Name;
        }
    }
}
