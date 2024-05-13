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
        public string Url { get; set; }

        public JqueryBind? Event { get; set; }

        public Func<JquerySelector, JquerySelectorExtend> FormSelector { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            var @event = Event?.ToStringLower() ?? Bindings.Grid.DataSourceInit;

            return iml.When(@event)
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
                    .OnError(dsl => OnError?.Invoke(dsl));
        }
    }

    public class Ajax : IGridDataSource
    {
        public string Url { get; set; }

        public JqueryBind? Event { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            var @event = Event?.ToStringLower() ?? Bindings.Grid.DataSourceInit;

            return iml.When(@event)
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
                .OnError(dsl => OnError?.Invoke(dsl));
        }
    }

    public class TemplateSyntax<T> : IGridDataSource
    {
        public Expression<Func<T, object>> Field { get; set; }

        public ITemplateSyntax<T> Template { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnBegin(dsl => controller.Init(dsl))
                      .OnSuccess(dsl => controller.AppendData(dsl, Template.For($"escapedJson {Field.GetMemberName()}")));
        }
    }

    public class Model : IGridDataSource
    {
        public object Data { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            if (Data is not IEnumerable)
                Data = new object[] { Data };

            var json = Data.ToJsonString();

            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnBegin(dsl => controller.Init(dsl))
                      .OnSuccess(dsl => controller.AppendData(dsl, HttpUtility.HtmlEncode(json)));
        }
    }

    public class SignalR : IGridDataSource
    {
        public string Method { get; set; }

        public int ChunkSize { get; set; } = 40;

        public JqueryBind Event { get; set; }

        public Selector Data { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnStart { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnComplete { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var controller = new IMLGridController(s => s.Self());

            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("signalrLoader", new
                      {
                          chunkSize = ChunkSize,
                          method = Method
                      }))
                      .When(Bindings.Grid.SignalR.Start)
                      .OnSuccess(dsl => OnStart?.Invoke(dsl))
                      .When(Bindings.Grid.SignalR.Complete)
                      .OnSuccess(dsl => OnComplete?.Invoke(dsl))
                      .When(Bindings.Grid.SignalR.Error)
                      .OnSuccess(dsl =>
                      {
                          dsl.With(s => s.Document()).Trigger.Invoke(JqueryBind.IncAjaxError);

                          OnError?.Invoke(dsl);
                      })
                      .When(Event)
                      .OnSuccess(dsl => controller.StartWebsocket(dsl, Data));
        }
    }
}
