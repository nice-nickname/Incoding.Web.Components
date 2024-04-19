namespace Incoding.Analyzer
{
    #region << Using >>

    using Microsoft.CodeAnalysis;

    #endregion

    internal static class Descriptors
    {
        internal static readonly DiagnosticDescriptor IML001MistypedUrlParameter = new DiagnosticDescriptor(
                    id: "IML001",
                    title: "Mistyped parameter",
                    messageFormat: "Mistyped parameter name '{0}', expected '{1}'",
                    category: "Validation",
                    defaultSeverity: DiagnosticSeverity.Warning,
                    isEnabledByDefault: true);

        internal static readonly DiagnosticDescriptor IML002UnknownUrlParameter = new DiagnosticDescriptor(
                    id: "IML002",
                    title: "Unknown Url paramter",
                    messageFormat: "Property '{0}' does not exist in type '{1}'",
                    category: "Validation",
                    defaultSeverity: DiagnosticSeverity.Error,
                    isEnabledByDefault: true);

    }
}
