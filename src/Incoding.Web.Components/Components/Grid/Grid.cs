namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Grid<T>
    {
        public string Id { get; }

        public string Css { get; set; }

        public List<Table<T>> Tables { get; set; } = new();

        public VirtualizationOptions Virtualization { get; set; } = new();

        public UIOptions UI { get; set; } = new();

        public ImlBinding Binds { get; set; } = dsl => dsl.When("_").OnSuccess(dsl => dsl.Self());

        public Grid(string id)
        {
            Id = id;
        }

        public class VirtualizationOptions
        {
            public bool InfinteScrolling { get; set; }

            public int ChunkSize { get; set; } = 40;
        }

        public class UIOptions
        {
            public bool HighlightRowsOnHover { get; set; }
        }
    }
}
