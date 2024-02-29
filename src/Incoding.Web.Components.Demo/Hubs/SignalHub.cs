namespace Incoding.Web.Components.Demo.Controllers
{

    #region << Using >>

    using Bogus;
    using System.Runtime.CompilerServices;
    using Microsoft.AspNetCore.SignalR;
    using Incoding.Core.Extensions;
    using Microsoft.AspNetCore.Mvc.Razor.Extensions;

    #endregion

    public class PaginatedResult
    {
        public List<SampleData> Items { get; set; }

        public bool IsNext { get; set; }
    }

    public class SignalHub : Hub
    {
        private List<SampleData> Data(int page, int pageSize)
        {
            Randomizer.Seed = new Random(123 + page);

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

            var data = fakerData.Generate(pageSize);

            foreach (var item in data)
            {
                item.Children = fakerData.Generate(5);

                foreach (var iitem in item.Children)
                {
                    iitem.Children = fakerData.Generate(5);
                }
            }

            return data;
        }

        public async IAsyncEnumerable<PaginatedResult> StreamData([EnumeratorCancellation] CancellationToken token)
        {
            var currentPage = 0;
            var allPages = 10;

            while (currentPage < allPages && !token.IsCancellationRequested)
            {
                var items = Data(currentPage++, 40);

                yield return new PaginatedResult
                {
                    Items = items,
                    IsNext = currentPage != allPages
                };

                Thread.Sleep(5.Seconds());
            }
        }
    }
}
