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
        Splitter = new Splitter();
    }

    public SplitBuilder Min(string width)
    {
        Splitter.MinWidth = width;

        return this;
    }

    public SplitBuilder Max(string width)
    {
        Splitter.MaxWidth = width;

        return this;
    }

    public SplitBuilder Width(string width)
    {
        Splitter.Width = width;

        return this;
    }
}
