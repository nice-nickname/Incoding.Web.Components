namespace Incoding.Analyzer
{
    #region << Using >>

    using Microsoft.CodeAnalysis.CSharp.Syntax;

    #endregion

    public static class AnonymousInitializerExtensions
    {
        public static string GetPropertyName(this AnonymousObjectMemberDeclaratorSyntax initializer)
        {
            return initializer?.NameEquals.Name.Identifier.Text;
        }
    }
}
