namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;
    using Incoding.Core.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;
    using Microsoft.AspNetCore.Routing;

    #endregion

    public record InputOptions
    {
        public string Value { get; set; }

        public string Css { get; set; }

        public string Name { get; set; }

        public object Attrs { get; set; }

        public string Placeholder { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnInit { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnChange { get; set; }
    }

    public record NumericOptions
    {
        public enum OfType
        {
            Decimal,

            Currency,

            Percentage
        }

        public bool AllowNegative { get; set; } = true;

        public bool AllowNullable { get; set; } = false;

        public int DecimalScale { get; set; } = ComponentsDefaults.DecimalScale;

        public OfType Type { get; set; } = OfType.Decimal;

        public InputOptions Input = new();
    }

    public record CheckboxOptions
    {
        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnUnchecked { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnChecked { get; set; }

        public bool IsChecked { get; set; }

        public InputOptions Input = new();
    }

    public record ExcelFieldOptions
    {
        public string Value { get; internal set; }
    }


    public partial class InputHtmlHelper
    {
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

            var inputBinds = this._html
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

            return this._html
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

            return this._html.When(JqueryBind.InitIncoding)
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

        public IHtmlContent Excel(Action<ExcelFieldOptions> buildAction)
        {
            var options = new ExcelFieldOptions();
            buildAction(options);

            this._html.When(JqueryBind.Click)
                      .OnSuccess(dsl => dsl.Self().JQuery.Attr.AddClass("selected"))
                      .When(JqueryBind.DblClick)

                      .AsHtmlAttributes(new
                      {

                      })
                      .ToDiv();

            return this._html.When(JqueryBind.InitIncoding)
                             .OnSuccess(dsl => dsl.Self())
                             .When(JqueryBind.DblClick)
                             .OnSuccess(dsl => dsl.Self().JQuery.SetSelection())
                             .When(JqueryBind.Focus)
                             .OnSuccess(dsl => dsl.Self().JQuery.Attr.Set("data-changed"))
                             .When(JqueryBind.KeyUp)
                             .OnSuccess(dsl =>
                             {

                             })
                             .AsHtmlAttributes(new RouteValueDictionary
                             {
                                 ["data-value"] = options.Value
                             })
                             .ToInput(HtmlInputType.Text, options.Value);
        }
    }
}
