namespace Incoding.Web.Components.Demo.Controllers
{
    #region << Using >>

    using Bogus;
    using System.Runtime.CompilerServices;
    using Microsoft.AspNetCore.SignalR;
    using Incoding.Core.Extensions;
    using JetBrains.Annotations;

    #endregion

    public class StreamParam<T>
    {
        public int ChunkSize { get; set; }

        public T QueryParams { get; set; }
    }

    public class StreamResult<T>
    {
        public IEnumerable<T> Items { get; set; }

        public bool IsNext { get; set; }
    }

    public class SignalHub : Hub
    {
        private List<SampleData> Data(int page, int pageSize)
        {
            Randomizer.Seed = new Random(123 + page);

            var fakerPeriod = new Faker<SamplePeriod>()
                              .RuleFor(s => s.Hours, f => f.Random.Decimal(0, 100))
                              .RuleFor(s => s.JTD, f => f.Random.Decimal(0, 100));

            var fakerData = new Faker<SampleData>()
                            .RuleFor(s => s.Id, s => s.Random.Guid().ToString())
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

            for (int i = 0; i < data.Count; i++)
            {
                data[i].Index = i;
            }

            return data;
        }

        public async IAsyncEnumerable<StreamResult<SampleData>> StreamData_Many_Floating(StreamParam<SampleQuery> @params, [EnumeratorCancellation] CancellationToken token)
        {
            var currentPage = 0;
            var allPages = 3;

            while (currentPage < allPages && !token.IsCancellationRequested)
            {
                await Task.Delay(5.Seconds(), token);

                var items = Data(currentPage++, @params.ChunkSize);

                if (currentPage == allPages)
                {
                    items = items.Slice(0, @params.ChunkSize / 3);
                }

                yield return new StreamResult<SampleData>
                             {
                                     Items = items,
                                     IsNext = currentPage != allPages
                             };
            }
        }

        public async IAsyncEnumerable<StreamResult<SampleData>> StreamData_Many(StreamParam<SampleQuery> @params, [EnumeratorCancellation] CancellationToken token)
        {
            var currentPage = 0;
            var allPages = 30;

            while (currentPage < allPages && !token.IsCancellationRequested)
            {
                var items = Data(currentPage++, @params.ChunkSize);

                yield return new StreamResult<SampleData>
                             {
                                     Items = items,
                                     IsNext = currentPage != allPages
                             };

                Thread.Sleep(1.Seconds());
            }
        }

        public async IAsyncEnumerable<StreamResult<SampleData>> StreamData_Small(StreamParam<SampleQuery> @params, [EnumeratorCancellation] CancellationToken token)
        {
            var currentPage = 0;
            var allPages = 1;

            while (currentPage < allPages && !token.IsCancellationRequested)
            {
                var items = Data(currentPage++, 5);

                yield return new StreamResult<SampleData>
                             {
                                     Items = items,
                                     IsNext = currentPage != allPages
                             };

                Thread.Sleep(5.Seconds());
            }
        }
    }
}
