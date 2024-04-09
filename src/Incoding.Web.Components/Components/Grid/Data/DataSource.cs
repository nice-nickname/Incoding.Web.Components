namespace Incoding.Web.Components.Grid;

#region << Using >>

using System;
using System.Collections;
using System.Linq.Expressions;
using System.Web;
using Incoding.Core.Extensions;
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

            var fieldName = Field.GetMemberName();

            return iml.When(Bindings.Grid.Init)
                    .OnBegin(dsl => controller.Init(dsl))
                    .OnSuccess(dsl => controller.AppendData(dsl, Template.For($"escapedJson {fieldName}")));
        }
    }

    public class Model : IGridDataSource
    {
        public object Data { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            if (!typeof(IEnumerable).IsAssignableFrom(Data.GetType()))
            {
                Data = new object[] { Data };
            }

            var json = Data.ToJsonString();

            return iml.When(Bindings.Grid.Init)
                    .OnBegin(dsl => controller.Init(dsl))
                    .OnSuccess(dsl => controller.AppendData(dsl, HttpUtility.HtmlEncode(json)));
        }
    }

    public class SignalR : IGridDataSource
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
                    .When(Bindings.Grid.SignalR.Start)
                    .OnSuccess(dsl =>
                    {
                        OnStart?.Invoke(dsl);
                    })
                    .When(Bindings.Grid.SignalR.Complete)
                    .OnSuccess(dsl =>
                    {
                        OnComplete?.Invoke(dsl);
                    })
                    .When(Bindings.Grid.SignalR.Error)
                    .OnSuccess(dsl =>
                    {
                        OnError?.Invoke(dsl);
                    });
        }
    }
}
