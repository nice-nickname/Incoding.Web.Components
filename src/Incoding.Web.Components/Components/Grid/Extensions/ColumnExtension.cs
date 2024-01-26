namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Mvc.Rendering;

    #endregion

    public static class ColumnExtension
    {
        public static ColumnBuilder<T> ReadonlyCheckboxProp<T>(this ColumnBuilder<T> columnBuilder, Expression<Func<T, object>> fieldExpr)
        {
            return columnBuilder.Prop(fieldExpr).Template(tmpl => $@"
                    <div class='checkbox checkbox-alternate'>
                        <label>
                            <input type='checkbox' {tmpl.IsInline(fieldExpr, "checked='checked'")} onclick='return false;'/>
                            <i class='cursor-default'></i>
                        </label>
                    </div>".ToMvcHtmlString());
        }
    }
}
