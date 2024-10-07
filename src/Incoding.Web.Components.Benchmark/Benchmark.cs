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

    public class GridRenderBenchmark
    {
        [Params(4)]
        public int SplitCount { get; set; }

        [Params(4)]
        public int MaxNested { get; set; }

        [Benchmark]
        public void RenderGrid()
        {
            Setup().Render();
        }

        private SplitGridBuilder<SampleData> Setup()
        {
            var id = "grid-component-benchmark";
            var css = "Lorem ipsum dolor sit amet.";

            var empty = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, sint ipsam? Ut sapiente laborum ducimus tempore deleniti quia voluptates veritatis odio illum alias! Aliquam, impedit at voluptatem necessitatibus neque ex?";

            ImlBinding binding = iml => iml.When(Bindings.Grid.Init).OnSuccess(dsl => dsl.Self());

            return new SplitGridBuilder<SampleData>(MockIHtmlHelper(), id)
                        .Css(css)
                        .Bind(binding)
                        .Empty(empty.ToMvcHtmlString())
                        .Split(splittings =>
                        {
                            for (int splitIndex = 0; splitIndex < SplitCount; splitIndex++)
                            {
                                void buildTable(TableBuilder<SampleData> table, int nestedIndex)
                                {
                                    table.Css(css)
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
                        .InfiniteScrolling(scroll =>
                        {
                            scroll.ChunkSize = 40;
                            scroll.LoadingRowsCount = 3;
                        })
                        .UI(ui =>
                        {
                            ui.PlaceholderRows = 20;
                        })
                        ;
        }

        [GlobalSetup]
        public void Bootstrap()
        {
            var services = new ServiceCollection();

            services.AddTransient<ITemplateFactory, TemplateHandlebarsFactory>();

            var provider = services.BuildServiceProvider();

            IoCFactory.Instance.Initialize(init => init.WithProvider(new MSDependencyInjectionIoCProvider(provider)));
        }

        private IHtmlHelper MockIHtmlHelper()
        {
            var mock = new Mock<IHtmlHelper>();

            var fakeWriter = new StringWriter(StringBuilderHelper.Default);

            mock.Setup(html => html.ViewContext).Returns(new ViewContext { Writer = fakeWriter });

            return mock.Object;
        }
    }
}
