namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc;

    #endregion

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
