namespace Incoding.Web.Components
{
    #region << Using >>

    using Incoding.Web.MvcContrib;

    #endregion

    public class GridController
    {
        private readonly string _controllerId;

        public GridController(string controllerId)
        {
            this._controllerId = controllerId;
        }

        public void Load(IIncodingMetaLanguageCallbackBodyDsl dsl)
        {
            dsl.WithId(this._controllerId).JQuery.Call("data('grid').load", Selector.Result);
        }
    }
}
