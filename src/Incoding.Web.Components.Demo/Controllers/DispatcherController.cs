namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    using Incoding.Web.MvcContrib;

    #endregion

    public class DispatcherController : DispatcherControllerBase
    {
        public DispatcherController(IServiceProvider serviceProvider)
                : base(serviceProvider) { }
    }
}
