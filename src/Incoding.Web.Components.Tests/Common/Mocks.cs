namespace Incoding.Web.Components.Test.Common;

using Microsoft.AspNetCore.Mvc.Rendering;
using Moq;

public static class Mocks
{
    public static IHtmlHelper HtmlHelper
    {
        get
        {
            var mock = new Mock<IHtmlHelper>();
            var fakeWriter = new StringWriter(StringBuilderHelper.Default);

            mock.Setup(html => html.ViewContext).Returns(new ViewContext { Writer = fakeWriter });

            return mock.Object;
        }
    }
}
