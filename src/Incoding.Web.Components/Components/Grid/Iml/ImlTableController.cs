namespace Incoding.Web.Components.Grid;

#region << Using >>

using Incoding.Web.MvcContrib;

#endregion

public class ImlTableController
{
    private readonly IIncodingMetaLanguageCallbackInstancesDsl _dsl;

    public ImlTableController(IIncodingMetaLanguageCallbackBodyDsl dsl)
    {
        _dsl = dsl.WithSelf(s => s.Closest(HtmlTag.Table));
    }

    public IExecutableSetting RemoveRow(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector rowId)
    {
        return _dsl.JQuery.Call("data('table').removeRow", rowId);
    }

    public IExecutableSetting RerenderRow(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector data)
    {
        return _dsl.JQuery.Call("data('table').rerenderRow", data);
    }
}
