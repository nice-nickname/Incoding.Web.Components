namespace Incoding.Analyzer
{
    #region << Using >>

    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.CSharp.Syntax;
    using Microsoft.CodeAnalysis.Diagnostics;
    using System.Collections.Immutable;
    using System;
    using System.Linq;

    #endregion

    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class UrlDispatcher_Analyzer : DiagnosticAnalyzer
    {
        public const string DiagnosticId = "IML001";

        public const string Category = "Validation";

        private static readonly DiagnosticDescriptor MistypedDescriptor =
                new DiagnosticDescriptor(DiagnosticId, "Title", "Incorrect parameter name: '{0}', expected '{1}'", Category, DiagnosticSeverity.Warning, isEnabledByDefault: true);

        private static readonly DiagnosticDescriptor UnknownPropertyDescriptor =
                new DiagnosticDescriptor(DiagnosticId, "Title", "Unknown property: '{0}' is not presented in '{1}'", Category, DiagnosticSeverity.Error, isEnabledByDefault: true);

        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get; } =
            ImmutableArray.Create(MistypedDescriptor, UnknownPropertyDescriptor);

        public override void Initialize(AnalysisContext context)
        {
            context.EnableConcurrentExecution();
            context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.Analyze | GeneratedCodeAnalysisFlags.ReportDiagnostics);

            context.RegisterSyntaxNodeAction(HandleInvocationExpression, SyntaxKind.InvocationExpression);
        }

        private void HandleInvocationExpression(SyntaxNodeAnalysisContext context)
        {
            var invocationExpr = (InvocationExpressionSyntax)context.Node;

            var memberAccessSyntax = invocationExpr.Expression as MemberAccessExpressionSyntax;

            if (memberAccessSyntax == null)
                return;

            var allowedMethods = new[] { "Query", "Push", "Model" };
            var methodName = memberAccessSyntax.Name.Identifier.Text;

            if (!allowedMethods.Contains(methodName))
                return;

            var nodes = memberAccessSyntax.ChildNodes();

            var genericNameSyntax = nodes?.LastOrDefault() as GenericNameSyntax;

            if (genericNameSyntax == null)
                return;

            var genericTypeArgument = genericNameSyntax.TypeArgumentList.Arguments.FirstOrDefault() as IdentifierNameSyntax;
            if (genericTypeArgument == null)
                return;

            var typeArgument = context.SemanticModel.GetTypeInfo(genericTypeArgument);

            if (typeArgument.Type == null)
                return;

            var anonymousObjectCreation = invocationExpr.ArgumentList.Arguments.FirstOrDefault().Expression as AnonymousObjectCreationExpressionSyntax;

            if (anonymousObjectCreation == null)
                return;

            AnalyzeUrlSchema(context, typeArgument.Type, anonymousObjectCreation.Initializers);
        }

        private void AnalyzeUrlSchema(SyntaxNodeAnalysisContext context, ITypeSymbol type, SeparatedSyntaxList<AnonymousObjectMemberDeclaratorSyntax> anonymousMembers)
        {
            var members = type.GetMembers();

            foreach (var initializer in anonymousMembers)
            {
                var property = initializer.GetPropertyName();

                if (property == null)
                    return;

                var propertyCaseInsensitive = members.FirstOrDefault(s => s.Name.Equals(property, StringComparison.InvariantCultureIgnoreCase));

                if (propertyCaseInsensitive == null)
                {
                    context.ReportDiagnostic(Diagnostic.Create(UnknownPropertyDescriptor, initializer.GetLocation(), property, type.Name));
                    return;
                }

                if (!propertyCaseInsensitive.Name.Equals(property, StringComparison.InvariantCulture))
                {
                    context.ReportDiagnostic(Diagnostic.Create(MistypedDescriptor, initializer.GetLocation(), property, propertyCaseInsensitive.Name));
                    return;
                }
            }
        }
    }
}
