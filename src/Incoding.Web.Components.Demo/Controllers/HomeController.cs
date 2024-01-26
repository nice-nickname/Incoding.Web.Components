namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    using Microsoft.AspNetCore.Mvc;

    #endregion

    public class HomeController : Controller
    {
        [Route("/data")]
        public IActionResult Data()
        {
            return Json(new { });
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
