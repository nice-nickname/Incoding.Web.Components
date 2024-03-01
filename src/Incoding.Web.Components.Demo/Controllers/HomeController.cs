namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    #region << Using >>

    using Bogus;
    using Incoding.Web.MvcContrib;
    using Microsoft.AspNetCore.Mvc;

    #endregion

    #endregion

    public class HomeController : Controller
    {
        [Route("/data")]
        public IActionResult Data()
        {
            return IncodingResult.Success(GenerateData(20));
        }

        [Route("/recalculate")]
        public IActionResult Recalculate()
        {
            return IncodingResult.Success(GenerateData(1)[0]);
        }

        [Route("/recalculate-without-children")]
        public IActionResult RecalculateWithoutChildren()
        {
            return IncodingResult.Success(GenerateData(1, false)[0]);
        }

        public IActionResult Index()
        {
            return View();
        }

        public static List<SampleData> GenerateData(int count, bool withChildren = true)
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
                            .RuleFor(s => s.Period, f => fakerPeriod.Generate(5))
                    ;

            var data = fakerData.Generate(count);

            if (withChildren)
            {
                foreach (var item in data)
                {
                    item.Children = fakerData.Generate(5);

                    foreach (var iitem in item.Children)
                    {
                        iitem.Children = fakerData.Generate(5);
                    }
                }
            }

            return data;
        }
    }
}
