namespace Incoding.Analyzer
{
    #region << Using >>

    using System.Collections.Immutable;
    using System.ComponentModel;
    using System.Composition;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CodeActions;
    using Microsoft.CodeAnalysis.CodeFixes;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.CSharp.Syntax;

    #endregion

    [Shared]
    [ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(UrlDispatcherWrongParamsCodeFixProvider))]
    internal class UrlDispatcherWrongParamsCodeFixProvider : CodeFixProvider
    {
        public override ImmutableArray<string> FixableDiagnosticIds { get; } =
            ImmutableArray.Create(Descriptors.IML001MistypedUrlParameter.Id, Descriptors.IML002UnknownUrlParameter.Id);

        public override async Task RegisterCodeFixesAsync(CodeFixContext context)
        {
            var root = await context.Document.GetSyntaxRootAsync(context.CancellationToken).ConfigureAwait(false);

            foreach (var diagnostic in root.GetDiagnostics())
            {
                var diagnosticSpan =  diagnostic.Location.SourceSpan;

                var invokationExpression = root
                    .FindToken(diagnosticSpan.Start).Parent
                    .AncestorsAndSelf()
                    .OfType<InvocationExpressionSyntax>()
                    .First();

                context.RegisterCodeFix(
                    CodeAction.Create(
                        title: "",
                        equivalenceKey: "",
                        createChangedDocument: ct => FixParametersAsync(context.Document, null, null, ct)
                    ),
                    diagnostic
                );
            }
        }

        private async Task<Document> FixParametersAsync(Document document, AnonymousObjectMemberDeclaratorSyntax initializer, ITypeSymbol type, CancellationToken cancellation)
        {
            var name = initializer.GetPropertyName();
            var first = initializer.GetFirstToken();

            initializer.NameEquals.Name.Update(SyntaxFactory.Identifier("Correcto"));

            return document;
        }
    }
}
