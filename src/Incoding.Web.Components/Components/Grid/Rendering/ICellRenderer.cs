namespace Incoding.Web.Components.Grid;

#region << Using >>

using System.IO;
using Incoding.Web.MvcContrib;

#endregion

public interface ICellRenderer<T>
{
    void Render(ITemplateSyntax<T> template, TextWriter content);
}
