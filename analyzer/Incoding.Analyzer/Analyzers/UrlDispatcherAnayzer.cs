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
    internal class UrlDispatcherAnayzer : DiagnosticAnalyzer
    {
        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get; } =
            ImmutableArray.Create(Descriptors.IML001MistypedUrlParameter, Descriptors.IML002UnknownUrlParameter);

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

            if (IsUrlDispatcherCall(memberAccessSyntax) &&
                HasGenericArgument(context, memberAccessSyntax, out var genericType) &&
                HasAnonymousObjectParameter(invocationExpr, out var anonymousCreation))
            {
                var members = genericType.GetMembers();

                foreach (var initializer in anonymousCreation.Initializers)
                {
                    var anonymousProp = initializer.GetPropertyName();

                    if (anonymousProp == null)
                        return;

                    var propertyCaseInsensitive = members.FirstOrDefault(s => s.Name.Equals(anonymousProp, StringComparison.InvariantCultureIgnoreCase));

                    if (propertyCaseInsensitive == null)
                    {
                        context.ReportDiagnostic(Diagnostic.Create(Descriptors.IML002UnknownUrlParameter, initializer.GetLocation(), anonymousProp, genericType.Name));
                        continue;
                    }

                    if (!propertyCaseInsensitive.Name.Equals(anonymousProp, StringComparison.InvariantCulture))
                    {
                        context.ReportDiagnostic(Diagnostic.Create(Descriptors.IML001MistypedUrlParameter, initializer.GetLocation(), anonymousProp, propertyCaseInsensitive.Name));
                        continue;
                    }
                }
            }
        }

        private static bool IsUrlDispatcherCall(MemberAccessExpressionSyntax memberAccess)
        {
            if (memberAccess == null)
                return false;

            var methodName = memberAccess.Name.Identifier.Text;

            return UrlDispatcherMethods.Contains(methodName);
        }

        private static bool HasGenericArgument(SyntaxNodeAnalysisContext context, MemberAccessExpressionSyntax memberAccess, out ITypeSymbol genericType)
        {
            genericType = null;
            var nodes = memberAccess.ChildNodes();

            var genericNameSyntax = nodes?.LastOrDefault() as GenericNameSyntax;

            if (genericNameSyntax == null)
                return false;

            var genericTypeArgument = genericNameSyntax.TypeArgumentList.Arguments.FirstOrDefault() as IdentifierNameSyntax;
            if (genericTypeArgument == null)
                return false;

            genericType = context.SemanticModel.GetTypeInfo(genericTypeArgument).Type;

            return genericType != null && genericType.IsReferenceType;
        }

        private static bool HasAnonymousObjectParameter(InvocationExpressionSyntax invocation, out AnonymousObjectCreationExpressionSyntax anonymous)
        {
            anonymous = invocation.ArgumentList.Arguments.FirstOrDefault().Expression as AnonymousObjectCreationExpressionSyntax;

            if (anonymous == null)
                return false;

            return true;
        }

        private static readonly string[] UrlDispatcherMethods = new[] { "Query", "Push", "Model" };
    }
}
