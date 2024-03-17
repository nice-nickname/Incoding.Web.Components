namespace Incoding.Web.Components
{
    #region << Using >>

    using System;
    using Incoding.Web.MvcContrib;
    #endregion

    public record CheckboxOptions
    {
        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnUnchecked { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnChecked { get; set; }

        public bool IsChecked { get; set; }

        public InputOptions Input = new();
    }
}
