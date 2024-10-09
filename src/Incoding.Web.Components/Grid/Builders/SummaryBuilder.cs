namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

#endregion

public class SummaryBuilder
{
    public Column Column { get; }

    public SummaryBuilder(Column column)
    {
        Column = column;
    }

    public SummaryBuilder FromString(string value)
    {
        Column.SummaryExpr = value;
        return this;
    }

    public SummaryBuilder FromExpr<T>(Expression<Func<IEnumerable<T>, object>> expression)
    {
        Column.SummaryExpr = new SummaryExpressionTranslator().Transform(expression);
        return this;
    }

    private sealed class SummaryExpressionTranslator : ExpressionVisitor
    {
        private static readonly IReadOnlySet<string> AggregateMethods = new HashSet<string>
                                                                        {
                                                                                nameof(Enumerable.Sum),
                                                                                nameof(Enumerable.Average),
                                                                                nameof(Enumerable.Min),
                                                                                nameof(Enumerable.Max),
                                                                                nameof(Enumerable.Count)
                                                                        };

        private static readonly IReadOnlyDictionary<string, string> OperationSymbols = new Dictionary<string, string>
                                                                                       {
                                                                                               ["op_Division"] = " / ",
                                                                                               ["op_Multiply"] = " * ",
                                                                                               ["op_Addition"] = " + ",
                                                                                               ["op_Subtraction"] = " - ",
                                                                                       };

        private readonly StringBuilder _builder = new(128);

        public string Transform(Expression expression)
        {
            Visit(expression);
            return _builder.ToString();
        }

        protected override Expression VisitBinary(BinaryExpression node)
        {
            Visit(node.Left);
            _builder.Append(OperationSymbols.GetValueOrDefault(node.Method?.Name, ""));
            Visit(node.Right);
            return node;
        }

        protected override Expression VisitMethodCall(MethodCallExpression node)
        {
            if (!AggregateMethods.Contains(node.Method.Name))
            {
                return base.VisitMethodCall(node);
            }

            this._builder.Append(node.Method.Name.ToUpperInvariant())
                .Append('(');

            foreach (var arg in node.Arguments)
            {
                Visit(arg);
            }

            this._builder.Append(')');
            return node;
        }

        protected override Expression VisitLambda<TLambda>(Expression<TLambda> node)
        {
            if (node.Body.NodeType == ExpressionType.Convert)
                return base.VisitLambda(node);

            if (node.Body is not MemberExpression member)
                return base.VisitLambda(node);

            if (member.Expression is MethodCallExpression nestedPropCall)
            {
                AppendNestedProperty(nestedPropCall);
            }

            this._builder.Append(member.Member.Name);

            return node;
        }

        protected override Expression VisitConstant(ConstantExpression node)
        {
            _builder.Append(node.Value);
            return node;
        }

        private void AppendNestedProperty(MethodCallExpression nestedCall)
        {
            if (nestedCall.Object is not MemberExpression nestedMember)
                return;

            _builder.Append(nestedMember.Member.Name)
                    .Append('.');

            var indexerMember = nestedCall.Arguments
                                          .OfType<MemberExpression>()
                                          .FirstOrDefault();

            if (indexerMember?.Expression is ConstantExpression indexerConstant)
            {
                var indexValue = indexerConstant.Type
                                                .GetField(indexerMember.Member.Name)?
                                                .GetValue(indexerConstant.Value);

                if (indexValue != null)
                {
                    _builder.Append(indexValue)
                            .Append('.');
                }
            }
        }
    }
}
