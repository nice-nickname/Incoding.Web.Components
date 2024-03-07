using Incoding.Web.MvcContrib;

namespace Incoding.Web.Components.Grid
{
    public class IMLGridController
    {
        public string Id { get; }

        public IMLGridController(string id)
        {
            Id = id;
        }

        public IExecutableSetting Init(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.WithId(this.Id).JQuery.Call("data('splitGrid').initializeTables");
        }

        public IExecutableSetting StartWebsocket(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.WithId(this.Id).JQuery.Call("data('loader').startLoading");
        }

        public IExecutableSetting CancelWebsocket(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.WithId(this.Id).JQuery.Call("data('loader').cancelLoading");
        }

        public IExecutableSetting AppendData(IIncodingMetaLanguageCallbackBodyDsl dsl, Selector dataSelector)
        {
            return dsl.WithId(this.Id).JQuery.Call("data('splitGrid').appendData", dataSelector);
        }

        public IExecutableSetting Totals(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            return dsl.WithId(this.Id).JQuery.Call("data('splitGrid').totals");
        }
    }
}
