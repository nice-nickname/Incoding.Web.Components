namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;

#endregion

public class ImlGridController
{
    private readonly IIncodingMetaLanguageCallbackInstancesDsl _dsl;

    public ImlGridController(IIncodingMetaLanguageCallbackBodyDsl dsl, string id)
            : this(dsl, s => s.Id(id)) { }

    public ImlGridController(IIncodingMetaLanguageCallbackBodyDsl dsl, Func<JquerySelector, JquerySelectorExtend> selector)
            : this(dsl.With(selector(Selector.Jquery))) { }

    public ImlGridController(IIncodingMetaLanguageCallbackInstancesDsl dsl)
    {
        _dsl = dsl;
    }

    public IExecutableSetting ClearData()
    {
        return _dsl.JQuery.Call("data('splitGrid')?.clearData");
    }

    public IExecutableSetting StartWebsocket(Selector @params = null)
    {
        return _dsl.JQuery.Call("data('loader').start", @params ?? string.Empty);
    }

    public IExecutableSetting CancelWebsocket()
    {
        return _dsl.JQuery.Call("data('loader')?.cancel");
    }

    public IExecutableSetting AppendData(Selector dataSelector)
    {
        return _dsl.JQuery.Call("data('splitGrid').appendData", dataSelector);
    }
}
