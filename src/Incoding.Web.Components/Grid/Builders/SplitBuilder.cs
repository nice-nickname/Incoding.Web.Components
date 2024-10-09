namespace Incoding.Web.Components.Grid;

#region << Using >>

using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class SplitBuilder
{
    public Splitter Splitter { get; }

    public IHtmlHelper Html { get; }

    public SplitBuilder(IHtmlHelper html)
    {
        Html = html;
        Splitter = new Splitter
                   {
                           MinWidth = "100px"
                   };
    }

    public SplitBuilder Min(string width)
    {
        Splitter.MinWidth = width;

        return this;
    }

    public SplitBuilder Min(int widthPx)
    {
        Splitter.MinWidth = widthPx + "px";

        return this;
    }

    public SplitBuilder Max(string width)
    {
        Splitter.MaxWidth = width;

        return this;
    }

    public SplitBuilder Max(int widthPx)
    {
        Splitter.MaxWidth = widthPx + "px";

        return this;
    }
}
