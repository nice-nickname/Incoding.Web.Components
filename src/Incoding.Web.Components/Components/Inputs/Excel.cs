namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;

    #endregion

    public record ExcelInputOptions
    {
        public string Value { get; set; }
    }

    public partial class InputHtmlHelper
    {
        public IHtmlContent Excel(Action<ExcelInputOptions> buildAction)
        {
            var options = new ExcelInputOptions();
            buildAction(options);

            return this._html.When(JqueryBind.InitIncoding)
                        .OnSuccess(dsl => dsl.Self())
                        .AsHtmlAttributes()
                        .ToTag(HtmlTag.Input);
        }
    }
}
