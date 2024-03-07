using BenchmarkDotNet.Running;

namespace Incoding.Web.Components.Benchmark
{
    #region << Using >>

    #endregion

    public class Program
    {
        public static void Main(string[] args)
        {
            BenchmarkRunner.Run<GridRenderBenchmark>();
        }
    }
}
