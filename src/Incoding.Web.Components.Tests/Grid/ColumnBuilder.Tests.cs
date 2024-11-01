namespace Incoding.Web.Components.Tests;

#region << Using >>

using Incoding.Web.Components.Grid;
using Incoding.Web.Components.Test.Common;

#endregion

public class ColumnBuilder_Tests : IDisposable
{
    public ColumnBuilder<SampleData> Builder { get; }

    public Column Column { get; }

    public ColumnBuilder_Tests()
    {
        Builder = new ColumnBuilder<SampleData>(Mocks.HtmlHelper);
        Column = Builder.Column;
    }

    [Fact]
    public void Css_ShouldSetClasses()
    {
        Builder.Css("lorem-ipsum");
        Builder.Css("dolor-sit");
        Builder.Css("amet");

        Assert.Equal(" lorem-ipsum dolor-sit amet", Column.Css);
    }

    public void Dispose() { }
}
