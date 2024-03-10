namespace Incoding.Web.Components.Grid
{
    public record GridDto
    {
        public bool HighlightRows { get; set; }

        public bool CascadeEvents { get; set; }

        public bool InfiniteScroll { get; set; }

        public int ScrollChunkSize { get; set; }


        public bool PartialLoad { get; set; }

        public int LoadingRowCount { get; set; }


        public GridStructureDto[] Structure { get; set; }

        public SplitterDto[] Splitter { get; set; }
    }
}
