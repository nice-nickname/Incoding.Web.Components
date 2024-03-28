namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Linq.Expressions;
using Incoding.Web.MvcContrib;

#endregion

public static class DataSource
{
    public class SubmitOn : IGridDataSource
    {
        public Func<JquerySelector, JquerySelectorExtend> FormSelector { get; set; }

        public string Url { get; set; }

        public JqueryBind Event { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            return iml.When(Event)
                    .SubmitOn(FormSelector)
                    .OnBegin(dsl =>
                    {
                        controller.Init(dsl);

                        dsl.With(FormSelector).JQuery.Attr.Set(HtmlAttribute.Action, Url);

                        OnBegin?.Invoke(dsl);
                    })
                    .OnSuccess(dsl =>
                    {
                        controller.AppendData(dsl, Selector.Result);

                        OnSuccess?.Invoke(dsl);
                    })
                    .OnError(dsl =>
                    {
                        OnError?.Invoke(dsl);
                    });
        }
    }

    public class Ajax : IGridDataSource
    {
        public string Url { get; set; }

        public JqueryBind Event { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            return iml.When(Event)
                .Ajax(Url)
                .OnBegin(dsl =>
                {
                    controller.Init(dsl);

                    OnBegin?.Invoke(dsl);
                })
                .OnSuccess(dsl =>
                {
                    controller.AppendData(dsl, Selector.Result);

                    OnSuccess?.Invoke(dsl);
                })
                .OnError(dsl =>
                {
                    OnError?.Invoke(dsl);
                });
        }
    }

    public class TemplateSyntax<T> : IGridDataSource
    {
        public Expression<Func<T, object>> Field { get; set; }

        public ITemplateSyntax<T> Template { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            var fieldName = ExpressionHelper.GetFieldName(Field);

            return iml.When(Bindings.Grid.Init)
                    .OnBegin(dsl => controller.Init(dsl))
                    .OnSuccess(dsl => controller.AppendData(dsl, Template.For($"json {fieldName}")));
        }
    }

    public class Websocket : IGridDataSource
    {
        public string Method { get; set; }

        public int ChunkSize { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnStart { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnComplete { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            return iml.When(Bindings.Grid.Init)
                    .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("websocketLoader", new
                    {
                        chunkSize = ChunkSize,
                        method = Method
                    }))
                    .When(Bindings.Grid.Websocket.Start)
                    .OnSuccess(dsl =>
                    {
                        OnStart?.Invoke(dsl);
                    })
                    .When(Bindings.Grid.Websocket.Complete)
                    .OnSuccess(dsl =>
                    {
                        OnComplete?.Invoke(dsl);
                    })
                    .When(Bindings.Grid.Websocket.Error)
                    .OnSuccess(dsl =>
                    {
                        OnError?.Invoke(dsl);
                    });
        }
    }
}
