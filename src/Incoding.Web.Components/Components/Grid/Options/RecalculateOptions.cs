namespace Incoding.Web.Components.Grid;

public record RecalculateOptions
{
    public static class Events
    {
        public static readonly string Recalculate = "recalculate";

        public static readonly string ReRender = "rerender";
    }

    public string Url { get; set; }
}
