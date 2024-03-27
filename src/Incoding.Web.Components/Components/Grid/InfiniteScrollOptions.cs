namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class InfiniteScrollOptions
    {
        public bool Enabled { get; set; }

        public int ChunkSize { get; set; }

        public int LoadingRowsCount { get; set; } = 3;
    }
}
