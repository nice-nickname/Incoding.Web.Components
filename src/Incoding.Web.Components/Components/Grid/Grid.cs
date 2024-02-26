namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    using System.Collections.Generic;

    #endregion

    public class Grid<T>
    {
        public string Id { get; }

        public List<Table<T>> Tables { get; set; } = new ();

        public ImlBinding Binds { get; set; } = dsl => dsl.When("_").OnSuccess(dsl => dsl.Self());

        public Grid(string id)
        {
            Id = id;
        }
    }
}
