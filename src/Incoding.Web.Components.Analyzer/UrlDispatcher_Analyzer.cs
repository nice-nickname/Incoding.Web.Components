
namespace Incoding.Web.Components.Analyzer;

#region << Using >>

using System.Diagnostics;
using System.Collections.Immutable;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;

#endregion

[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class UrlDispatcher_Analyzer : DiagnosticAnalyzer
{
    private static readonly string Category = "Naming";

    private static readonly DiagnosticDescriptor Rule = new DiagnosticDescriptor(DiagnosticId, "Title", "Incorrect parameter naming: '{0}'", Category, DiagnosticSeverity.Warning, isEnabledByDefault: true);

    public const string DiagnosticId = "UrlDispatcher_ParameterAnalyzer";

    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get; } = ImmutableArray.Create(Rule);

    public override void Initialize(AnalysisContext context)
    {
        context.RegisterSyntaxNodeAction(AnalyzeSyntax, SyntaxKind.InvocationExpression);
    }

    private void AnalyzeSyntax(SyntaxNodeAnalysisContext context)
    {
        var invocation = (InvocationExpressionSyntax)context.Node;

        // Check if it's a call to the method Query
        if (invocation.Expression is MemberAccessExpressionSyntax memberAccess &&
            memberAccess.Name.Identifier.Text == "Query")
        {
            var diagnostic = Diagnostic.Create(Rule, invocation.GetLocation(), memberAccess.Name);
            context.ReportDiagnostic(diagnostic);
        }
    }
}
