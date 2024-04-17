namespace Incoding.Web.Components.Grid;

public record InfiniteScrollOptions
{
    public int ChunkSize { get; set; } = 50;

    public int LoadingRowsCount { get; set; } = 3;
}
