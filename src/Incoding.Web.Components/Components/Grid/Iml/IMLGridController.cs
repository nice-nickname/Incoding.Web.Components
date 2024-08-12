namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.MvcContrib;

#endregion

public class ImlGridController
{
    private readonly IIncodingMetaLanguageCallbackInstancesDsl _dsl;

    public ImlGridController(IIncodingMetaLanguageCallbackBodyDsl dsl, string id)
        : this(dsl, s => s.Id(id))
    { }

    public ImlGridController(IIncodingMetaLanguageCallbackBodyDsl dsl, Func<JquerySelector, JquerySelectorExtend> selector)
        : this(dsl.With(selector(Selector.Jquery)))
    { }

    public ImlGridController(IIncodingMetaLanguageCallbackInstancesDsl dsl)
    {
        this._dsl = dsl;
    }

    public IExecutableSetting Init()
    {
        return this._dsl.JQuery.Call("data('splitGrid')?.initializeTables");
    }

    public IExecutableSetting StartWebsocket(Selector @params = null)
    {
        return this._dsl.JQuery.Call("data('loader').startLoading", @params);
    }

    public IExecutableSetting CancelWebsocket()
    {
        return this._dsl.JQuery.Call("data('loader').cancelLoading");
    }



    public IExecutableSetting AppendData(Selector dataSelector)
    {
        return this._dsl.JQuery.Call("data('splitGrid').appendData", dataSelector);
    }

    public IExecutableSetting Totals()
    {
        return this._dsl.JQuery.Call("data('splitGrid').totals");
    }
}
