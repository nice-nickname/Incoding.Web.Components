namespace Incoding.Web.Components.Demo.Controllers
{
    using Bogus;
    using Incoding.Core.Block.IoC;
    using Incoding.Web.MvcContrib;

    #region << Using >>

    using Microsoft.AspNetCore.Mvc;

    #endregion

    public class HomeController : Controller
    {
        [Route("/data")]
        public IActionResult Data()
        {
            Randomizer.Seed = new Random(123);

            var fakerPeriod = new Faker<SamplePeriod>()
                .RuleFor(s => s.Hours, f => f.Random.Decimal(0, 100))
                .RuleFor(s => s.JTD, f => f.Random.Decimal(0, 100))
                ;

            var fakerData = new Faker<SampleData>()
                .RuleFor(s => s.Id, s => Guid.NewGuid().ToString())
                .RuleFor(s => s.Name, s => s.Name.FirstName())
                .RuleFor(s => s.Description, s => s.Hacker.Phrase())
                .RuleFor(s => s.Amount, s => s.Random.Int(0, 100))
                .RuleFor(s => s.AmountPercentage, s => s.Random.Decimal(-1000, 1000))
                .RuleFor(s => s.Balance, s => s.Random.Decimal(-1000, 1000))
                .RuleFor(s => s.JTDDollars, s => s.Random.Decimal(-1000, 1000))
                .RuleFor(s => s.JTDHours, s => s.Random.Decimal(-1000, 1000))
                .RuleFor(s => s.Start, s => s.Date.Past())
                .RuleFor(s => s.End, s => s.Date.Future())
                .RuleFor(s => s.Period, f => fakerPeriod.Generate(12))
                ;

            var data = fakerData.Generate(20);

            return Json(data);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
