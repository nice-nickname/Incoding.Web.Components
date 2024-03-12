namespace Incoding.Web.Components.Benchmark
{
    #region << Using >>

    using BenchmarkDotNet.Attributes;
    using Incoding.Core.Block.IoC;
    using Incoding.Core.Block.IoC.Provider;
    using Incoding.Web.Components;
    using Incoding.Web.Components.Grid;
    using Incoding.Web.Extensions;
    using Incoding.Web.MvcContrib;
    using JetBrains.Annotations;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.Extensions.DependencyInjection;
    using Moq;

    #endregion

    public static class BenchmarkBootstrapper
    {
        public static void Start()
        {
            var services = new ServiceCollection();

            services.AddTransient<ITemplateFactory, TemplateHandlebarsFactory>();

            var provider = services.BuildServiceProvider();

            IoCFactory.Instance.Initialize(init => init.WithProvider(new MSDependencyInjectionIoCProvider(provider)));
        }
    }

    public class GridRenderBenchmark
    {
        [Params(4)]
        public int SplitCount { get; set; }

        [Params(4)]
        public int MaxNested { get; set; }

        [Benchmark]
        public void Concurrent()
        {
            BenchmarkBootstrapper.Start();

            Setup().Render(useConcurrentRender: true);
        }

        [Benchmark]
        public void Synchronous()
        {
            BenchmarkBootstrapper.Start();

            Setup().Render(useConcurrentRender: false);
        }

        private IHtmlHelper MockIHtmlHelper()
        {
            var mock = new Mock<IHtmlHelper>();

            var fakeWriter = new StringWriter(StringBuilderHelper.Default);

            mock.Setup(html => html.ViewContext).Returns(new ViewContext { Writer = fakeWriter });

            return mock.Object;
        }

        private GridBuilder<SampleData> Setup()
        {
            var id = "grid-component-benchmark";
            var css = "Lorem ipsum dolor sit amet.";

            var empty = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, sint ipsam? Ut sapiente laborum ducimus tempore deleniti quia voluptates veritatis odio illum alias! Aliquam, impedit at voluptatem necessitatibus neque ex?";

            var attr = new { name = "viva vidi vici" };

            ImlBinding binding = iml => iml.When(Bindings.Grid.Init)
                                                    .OnSuccess(dsl => dsl.Self());

            return new GridBuilder<SampleData>(MockIHtmlHelper(), id)
                        .Css(css)
                        .Bind(binding)
                        .Empty(empty.ToMvcHtmlString())
                        .Attr(attr)
                        .Split(splittings =>
                        {
                            for (int splitIndex = 0; splitIndex < SplitCount; splitIndex++)
                            {
                                void buildTable(TableBuilder<SampleData> table, int nestedIndex)
                                {
                                    table.Attr(attr)
                                         .Bind(binding)
                                         .Css(css)
                                         .Layout(LayoutType.Fixed)
                                         .Rows(r => r.Css(css))
                                         .Columns(cols =>
                                         {
                                             cols.Add().Field(s => s.Name).Width(70);
                                             cols.Add().Field(s => s.Description).Title("Notes").Width(200);

                                             cols.Add().Field(s => s.Amount).Width(70).Format(ColumnFormat.Currency).Totalable();
                                             cols.Add().Field(s => s.AmountPercentage).Title("Amount %").Format(ColumnFormat.Percentage).Width(70);
                                             cols.Add().Field(s => s.Balance).Width(70);

                                             cols.Stacked(s => s.Title("Dates"),
                                                             cols =>
                                                             {
                                                                 cols.Add().Field(s => s.Start).Width(70);
                                                                 cols.Add().Field(s => s.End).Width(70);
                                                             });

                                             cols.Spreaded(s => s.Period, 5, (cols, i) =>
                                             {
                                                 cols.Stacked(s => s.Title(DateTime.Now.AddDays(i).ToShortDateString()),
                                                             cols =>
                                                             {
                                                                 cols.Add().Field(s => s.Hours).Title("Hrs").Width(70).Totalable();
                                                                 cols.Add().Field(s => s.JTD).Title("$").Width(70).Totalable();
                                                             });
                                             });
                                         });

                                    if (nestedIndex < MaxNested)
                                    {
                                        table.Nested(s => s.Children, t => buildTable(t, nestedIndex + 1));
                                    }
                                }
                                splittings.Add("split-" + splitIndex, t => buildTable(t, 1));
                            }
                        })
                        .InfiniteScrolling(chunkSize: 40)
                        .UI(ui =>
                        {
                            ui.CascadeEvents = true;
                            ui.HighlightRowsOnHover = true;
                        })
                        .WebsocketLoader(ws =>
                        {
                            ws.ChunkSize = 40;
                            ws.LoadingRows = 3;
                            ws.Method = "SPQR";
                        });
        }
    }
}
