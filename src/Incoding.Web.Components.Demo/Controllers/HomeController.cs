namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc;
    using Incoding.Web.Components.Grid;

    #endregion

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
