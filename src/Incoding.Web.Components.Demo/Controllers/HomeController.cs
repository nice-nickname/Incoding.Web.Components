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

        public IActionResult Babah()
        {
            var cols = new List<Column>();

            cols.Add(new Column
            {
                Totalable = true,
                Title = "Id",
                Css = "",
                Cell = new Cell
                {
                    Field = "Id",
                    Format = ColumnFormat.Numeric,
                    Type = ColumnType.Numeric
                }
            });

            return Json(cols);
        }
    }
}
