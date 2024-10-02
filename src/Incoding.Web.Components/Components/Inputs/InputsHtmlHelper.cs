namespace Incoding.Web.Components;

#region << Using >>

using System;
using System.Linq.Expressions;
using Incoding.Core.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class InputHtmlHelper
{
    private readonly IHtmlHelper _html;

    public InputHtmlHelper(IHtmlHelper html)
    {
        _html = html;
    }

    public IHtmlContent Text(Action<InputOptions> buildAction)
    {
        var options = new InputOptions();
        buildAction(options);

        var attrs = AttributesHelper.Merge(new
        {
            name = options.Name,
            @class = options.Css,
            placeholder = options.Placeholder
        }, options.Attrs);

        attrs["data-value"] = options.Value;

        Expression<Func<bool>> isEscape = () => Selector.Event.Which == (int)KeyCode.escape;

        var inputBinds = _html
                             .When(JqueryBind.InitIncoding)
                             .OnSuccess(dsl =>
                             {
                                 dsl.Self().JQuery.Attr.Set("data-value", Selector.Jquery.Self());

                                 options.OnInit?.Invoke(dsl);
                             })
                             .When(JqueryBind.Change)
                             .OnSuccess(dsl =>
                             {
                                 dsl.Self().JQuery.Attr.Set("data-value", Selector.Jquery.Self());

                                 options.OnChange?.Invoke(dsl);
                             })
                             .When(JqueryBind.KeyUp)
                             .OnSuccess(dsl =>
                             {
                                 dsl.Self().JQuery.Attr.Val(Selector.Jquery.Self().Attr("data-value")).If(isEscape);
                             });

        return inputBinds.AsHtmlAttributes(attrs)
                         .ToInput(HtmlInputType.Text, options.Value);
    }

    public IHtmlContent Numeric(Action<NumericOptions> buildAction)
    {
        var options = new NumericOptions();
        buildAction(options);

        var attrs = AttributesHelper.Merge(new
        {
            name = options.Input.Name,
            @class = options.Input.Css,
            placeholder = options.Input.Placeholder
        }, options.Input.Attrs);

        Expression<Func<bool>> isEscape = () => Selector.Event.Which == (int)KeyCode.escape;

        return _html
                   .When(JqueryBind.InitIncoding)
                   .StopPropagation()
                   .OnSuccess(dsl =>
                              {
                                  dsl.Self().JQuery.PlugIn("maskedInput",
                                                           new
                                                           {
                                                               type = options.Type.ToJqueryString(),
                                                               decimalScale = options.DecimalScale,
                                                               nullable = options.AllowNullable,
                                                               negative = options.AllowNegative
                                                           });

                                  dsl.Self().JQuery.Attr.Set("data-value", Selector.Jquery.Self());

                                  options.Input.OnInit?.Invoke(dsl);
                              })
                   .When(JqueryBind.Change)
                   .OnSuccess(dsl =>
                   {
                       dsl.Self().JQuery.Attr.Set("data-value", Selector.Jquery.Self());

                       options.Input.OnChange?.Invoke(dsl);

                   })
                   .When(JqueryBind.KeyUp)
                   .OnSuccess(dsl =>
                   {
                       dsl.Self().JQuery.Attr.Val(Selector.Jquery.Self().Attr("data-value")).If(isEscape);
                   })
                   .AsHtmlAttributes(attrs)
                   .ToInput(HtmlInputType.Text, options.Input.Value);
    }

    public IHtmlContent Checkbox(Action<CheckboxOptions> buildAction)
    {
        var options = new CheckboxOptions();
        buildAction(options);

        var attrs = AttributesHelper.Merge(new
        {
            name = options.Input.Name,
            @class = options.Input.Css,
            title = options.Input.Placeholder
        }, options.Input.Attrs);

        if (options.IsChecked)
        {
            attrs["checked"] = "checked";
        }

        return _html.When(JqueryBind.InitIncoding)
                         .OnSuccess(dsl => options.Input.OnInit?.Invoke(dsl))
                         .When(JqueryBind.Change)
                         .OnSuccess(dsl =>
                         {

                             dsl.Self().Trigger.Invoke("checked").If(() => Selector.Jquery.Self().Property("prop('checked')"));
                             dsl.Self().Trigger.Invoke("unchecked").If(() => !Selector.Jquery.Self().Property("prop('checked')"));

                             options.Input.OnChange?.Invoke(dsl);
                         })
                         .When("checked")
                         .StopPropagation()
                         .OnSuccess(dsl => options.OnChecked?.Invoke(dsl))
                         .When("unchecked")
                         .StopPropagation()
                         .OnSuccess(dsl => options.OnUnchecked?.Invoke(dsl))
                         .AsHtmlAttributes(attrs)
                         .ToInput(HtmlInputType.CheckBox, options.Input.Value);
    }
}
