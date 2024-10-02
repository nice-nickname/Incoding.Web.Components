namespace Incoding.Web.Components.Grid;

public record RecalculateOptions
{
    public string Url { get; set; }

    public static class Events
    {
        public static readonly string Recalculate = "recalculate";

        public static readonly string ReRender = "rerender";
    }
}
