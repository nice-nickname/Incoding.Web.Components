using System;
using Incoding.Web.MvcContrib;

namespace Incoding.Web.Components.Grid
{
    public class IMLTableController
    {
        public IExecutableSetting RemoveRow(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector rowId)
        {
            return dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('grid').removeRow", rowId);
        }

        public IExecutableSetting RerenderRow(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector data)
        {
            return dsl.WithSelf(s => s.Closest(HtmlTag.Table)).JQuery.Call("data('grid').rerenderRow", data);
        }
    }

    public class IMLGridController
    {
        private readonly JquerySelectorExtend _selector;

        public IMLGridController(string id)
        {
            this._selector = id.ToId();
        }

        public IMLGridController(Func<JquerySelector, JquerySelectorExtend> selector)
        {
            this._selector = selector(Selector.Jquery);
        }

        public IExecutableSetting Init(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.With(this._selector).JQuery.Call("data('splitGrid').initializeTables");
        }

        public IExecutableSetting StartWebsocket(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector @params = null)
        {
            return dsl.With(this._selector).JQuery.Call("data('loader').startLoading", @params);
        }

        public IExecutableSetting CancelWebsocket(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.With(this._selector).JQuery.Call("data('loader').cancelLoading");
        }

        public IExecutableSetting AppendData(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector dataSelector)
        {
            return dsl.With(this._selector).JQuery.Call("data('splitGrid').appendData", dataSelector);
        }

        public IExecutableSetting Totals(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.With(this._selector).JQuery.Call("data('splitGrid').totals");
        }
    }
}
