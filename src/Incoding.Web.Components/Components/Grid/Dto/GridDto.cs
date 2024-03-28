namespace Incoding.Web.Components.Grid;

public record GridDto
{
    public bool InfiniteScroll { get; set; }

    public int ScrollChunkSize { get; set; }


    public bool PartialLoad { get; set; }

    public int LoadingRowCount { get; set; }


    public TableOptionsDto Table { get; set; }

    public GridStructureDto[] Structure { get; set; }

    public SplitterDto[] Splitter { get; set; }
}
