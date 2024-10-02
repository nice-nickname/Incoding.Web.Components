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
    public Grid<T> Grid { get; }

    public GridStyles.Stylings DefaultStyles { get; set; }

    public IHtmlHelper Html { get; }

    public SplitGridBuilder(IHtmlHelper html, string id)
    {
        Html = html;
        Grid = new Grid<T>(id);

        DefaultStyles = GridStyles.Default();
    }

    public SplitGridBuilder<T> Width(string width)
    {
        Grid.Width = width;

        return this;
    }

    public SplitGridBuilder<T> Height(string height)
    {
        Grid.Height = height;

        return this;
    }

    public SplitGridBuilder<T> Height(int px)
    {
        return Height($"{px}px");
    }

    public SplitGridBuilder<T> Css(string css)
    {
        Grid.Css += " " + css;

        return this;
    }

    public SplitGridBuilder<T> Attr(string attr, string value)
    {
        Grid.Attr[attr] = value;

        return this;
    }

    public SplitGridBuilder<T> Attr(object attrs)
    {
        foreach (var (key, value) in AnonymousHelper.ToDictionary(attrs))
        {
            Attr(key, value.ToString());
        }

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

    public SplitGridBuilder<T> Split(Action<TableSplitBuilder<T>> splits)
    {
        var splitter = new TableSplitBuilder<T>(Html, DefaultStyles);

        splits(splitter);

        Grid.Tables.AddRange(splitter.Tables);
        Grid.Splits.AddRange(splitter.Splits);

        return this;
    }

    public SplitGridBuilder<T> Table(Action<TableBuilder<T>> table)
    {
        return Split(splits => splits.Add(Grid.Id + "-table", table));
    }

    public SplitGridBuilder<T> Bind(ImlBinding binding)
    {
        if (Grid.Binds != null)
        {
            var origin = Grid.Binds;

            Grid.Binds = iml =>
                         {
                             origin(iml);
                             binding(iml);

                             return iml;
                         };

            return this;
        }

        Grid.Binds = binding;

        return this;
    }

    public SplitGridBuilder<T> Empty(IHtmlContent content)
    {
        Grid.EmptyContent = content;

        return this;
    }

    public SplitGridBuilder<T> Empty(Func<dynamic, IHtmlContent> content)
    {
        Grid.EmptyContent = content(null);

        return this;
    }

    public SplitGridBuilder<T> DataSource(IGridDataSource dataSource)
    {
        Grid.DataSource = dataSource;

        return this;
    }

    public SplitGridBuilder<T> Recalculate(Action<RecalculateOptions> buildAction)
    {
        var options = new RecalculateOptions();
        buildAction(options);

        return Bind(iml => iml.When(RecalculateOptions.Events.Recalculate)
                              .StopPropagation()
                              .Ajax(options.Url)
                              .OnBegin(dsl => dsl.With(s => s.EqualsAttribute("data-row-id", Selector.Event.Data.For("RowId")))
                                                 .JQuery.Attr.AddClass("loading"))
                              .OnSuccess(dsl => dsl.Self().Call("triggerRerender", Selector.Result))
                   );
    }

    public SplitGridBuilder<T> Mode(GridMode mode)
    {
        Grid.Mode = mode;

        return this;
    }

    public SplitGridBuilder<T> Styling(Func<GridStyles.Stylings> stylings)
    {
        DefaultStyles = stylings();

        return this;
    }

    public IHtmlContent Render()
    {
        return new SplitGridRenderer<T>(Html, Grid, DefaultStyles).Render(concurrent: false);
    }
}
