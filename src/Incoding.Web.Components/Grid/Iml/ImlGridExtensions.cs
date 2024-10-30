namespace Incoding.Web.Components.Grid;

#region << Using >>

using Incoding.Web.MvcContrib;

#endregion

public static class ImlGridExtensions
{
    public static ImlGridController Grid(this IIncodingMetaLanguageCallbackBodyDsl dsl) => new ImlGridController(dsl, s => s.Self());

    public static ImlGridController Grid(this IIncodingMetaLanguageCallbackInstancesDsl dsl) => new ImlGridController(dsl);

    public static ImlTableController Table(this IIncodingMetaLanguageCallbackBodyDsl dsl) => new ImlTableController(dsl);
}
