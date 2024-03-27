namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using Incoding.Web.MvcContrib;

    #endregion

    public interface IGridDataSource
    {
        IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml);
    }
}
