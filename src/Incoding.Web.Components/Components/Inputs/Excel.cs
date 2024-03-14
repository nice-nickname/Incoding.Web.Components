namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Core.Extensions;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Html;

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

        public InputOptions Input = new();
    }

    public partial class InputHtmlHelper
    {
        public IHtmlContent Text(Action<InputOptions> buildAction)
        {
            var options = new InputOptions();
            buildAction(options);

            var defaultAttrs = new
            {
                name = options.Name,
                @class = options.Css,
                placeholder = options.Placeholder
            };

            var inputBinds = this._html
                                 .When(JqueryBind.Change)
                                 .OnSuccess(dsl => options.OnChange?.Invoke(dsl))
                                 .When(JqueryBind.FocusIn)
                                 .OnSuccess(dsl => dsl.Self().JQuery.SetSelection());

            if (options.OnInit != null)
            {
                inputBinds = inputBinds.When(JqueryBind.InitIncoding)
                                       .OnSuccess(options.OnInit);
            }

            return inputBinds.AsHtmlAttributes(AttributesHelper.Merge(defaultAttrs, options.Attrs))
                             .ToInput(HtmlInputType.Text, options.Value);
        }

        public IHtmlContent Numeric(Action<NumericOptions> buildAction)
        {
            var options = new NumericOptions();
            buildAction(options);

            var defaultAttrs = new
            {
                name = options.Input.Name,
                @class = options.Input.Css,
                placeholder = options.Input.Placeholder
            };

            return this._html
                       .When(JqueryBind.InitIncoding)
                       .StopPropagation()
                       .OnSuccess(dsl =>
                                  {
                                      options.Input.OnInit?.Invoke(dsl);

                                      dsl.Self().JQuery.PlugIn("maskedInput",
                                                               new
                                                               {
                                                                   type = options.Type.ToJqueryString(),
                                                                   decimalScale = options.DecimalScale,
                                                                   nullable = options.AllowNullable,
                                                                   negative = options.AllowNegative,
                                                                   selectOnFocus = true
                                                               });
                                  })
                       .When(JqueryBind.Change)
                       .OnSuccess(dsl => options.Input.OnChange?.Invoke(dsl))
                       .AsHtmlAttributes(AttributesHelper.Merge(defaultAttrs, options.Input.Attrs))
                       .ToInput(HtmlInputType.Text, options.Input.Value);
        }
    }
}
