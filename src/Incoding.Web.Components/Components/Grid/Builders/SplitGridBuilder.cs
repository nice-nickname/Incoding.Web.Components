namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using Incoding.Web.Extensions;
using Incoding.Web.MvcContrib;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#endregion

public class SplitGridBuilder<T>
{
    private ImlBinding _binds;

    public SplitGrid Grid { get; }

    public IHtmlHelper Html { get; }

    public SplitGridBuilder(IHtmlHelper html)
            : this(html, Guid.NewGuid().ToString()) { }

    public SplitGridBuilder(IHtmlHelper html, string id)
    {
        Html = html;
        Grid = new SplitGrid(id)
               {
                       Width = "100%",
                       Height = "100%",
                       Format = FormatOptions.Default()
               };
    }

    public SplitGridBuilder<T> Width(string width)
    {
        Grid.Width = width;

        return this;
    }

    public SplitGridBuilder<T> Width(int widthPx)
    {
        Grid.Width = $"{widthPx}px";

        return this;
    }

    public SplitGridBuilder<T> Height(string height)
    {
        Grid.Height = height;

        return this;
    }

    public SplitGridBuilder<T> Height(int heightPx)
    {
        return Height($"{heightPx}px");
    }

    public SplitGridBuilder<T> Css(string css)
    {
        Grid.Css += " " + css;

        return this;
    }

    public SplitGridBuilder<T> InfiniteScrolling(Action<InfiniteScrollOptions> scrollOptions)
    {
        Grid.InfiniteScroll = new InfiniteScrollOptions();
        scrollOptions(Grid.InfiniteScroll);

        return this;
    }

    public SplitGridBuilder<T> InfiniteScrolling()
    {
        Grid.InfiniteScroll = new InfiniteScrollOptions();

        return this;
    }

    public SplitGridBuilder<T> UI(Action<UIOptions> uiOptions)
    {
        Grid.UI = new UIOptions();
        uiOptions(Grid.UI);

        return this;
    }

    public SplitGridBuilder<T> Format(Action<FormatOptions> formatOptions)
    {
        Grid.Format = new FormatOptions();
        formatOptions(Grid.Format);

        return this;
    }

    public SplitGridBuilder<T> Split(Action<TableSplitBuilder<T>> splits)
    {
        using (var htmlWrapper = new StringifiedHtmlHelperWrapper<T>(Html, StringBuilderHelper.Default))
        {
            var splitter = new TableSplitBuilder<T>(Html);
            splits(splitter);

            Grid.Tables.AddRange(splitter.Tables);
            Grid.Splits.AddRange(splitter.Splits);
        }

        return this;
    }

    public SplitGridBuilder<T> Table(Action<TableBuilder<T>> table)
    {
        return Split(splits => splits.Add(Grid.Id + "-table", table));
    }

    public SplitGridBuilder<T> Bind(ImlBinding binding)
    {
        if (_binds != null)
        {
            var prevBinds = _binds;

            _binds = iml =>
                     {
                         prevBinds(iml);
                         binding(iml);

                         return iml;
                     };

            return this;
        }

        _binds = binding;

        return this;
    }

    public SplitGridBuilder<T> Empty(IHtmlContent content)
    {
        Grid.EmptyContent = content.HtmlContentToString();

        return this;
    }

    public SplitGridBuilder<T> Empty(Func<dynamic, IHtmlContent> content)
    {
        Grid.EmptyContent = content(null).HtmlContentToString();

        return this;
    }

    public SplitGridBuilder<T> DataSource(IGridDataSource dataSource)
    {
        Bind(dataSource.Bind);

        return this;
    }

    public SplitGridBuilder<T> Mode(GridMode mode)
    {
        Grid.Mode = mode;

        return this;
    }

    public IHtmlContent Render()
    {
        var renderer = new SplitGridRenderer(Html, Grid)
                       {
                               Binds = _binds
                       };

        return renderer.Render();
    }
}
