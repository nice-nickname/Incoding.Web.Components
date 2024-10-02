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

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnComplete { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var events = PrepareEvents(Event);

            return iml.When(events)
                      .SubmitOn(FormSelector)
                      .OnBegin(dsl =>
                               {
                                   dsl.Grid().Init();

                                   dsl.With(FormSelector).JQuery.Attr.Set(HtmlAttribute.Action, Url);

                                   OnBegin?.Invoke(dsl);
                               })
                      .OnSuccess(dsl =>
                                 {
                                     dsl.Grid().AppendData(Selector.Result);

                                     OnSuccess?.Invoke(dsl);
                                 })
                      .OnComplete(dsl => OnComplete?.Invoke(dsl))
                      .OnError(dsl => OnError?.Invoke(dsl));
        }
    }

    public class Ajax : IGridDataSource
    {
        public string Url { get; set; }

        public JqueryBind? Event { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnBegin { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnSuccess { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnComplete { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            var events = PrepareEvents(Event);

            return iml.When(events)
                      .Ajax(Url)
                      .OnBegin(dsl =>
                               {
                                   dsl.Grid().Init();

                                   OnBegin?.Invoke(dsl);
                               })
                      .OnSuccess(dsl =>
                                 {
                                     dsl.Grid().AppendData(Selector.Result);

                                     OnSuccess?.Invoke(dsl);
                                 })
                      .OnComplete(dsl => OnComplete?.Invoke(dsl))
                      .OnError(dsl => OnError?.Invoke(dsl));
        }
    }

    public class TemplateSyntax<T> : IGridDataSource
    {
        public Expression<Func<T, object>> Field { get; set; }

        public ITemplateSyntax<T> Template { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnBegin(dsl => dsl.Grid().Init())
                      .OnSuccess(dsl => dsl.Grid().AppendData(Template.For($"escapedJson {Field.GetMemberName()}")));
        }
    }

    public class Model : IGridDataSource
    {
        public object Data { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            if (Data is not IEnumerable)
                Data = new object[] { Data };

            var json = Data.ToJsonString();

            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnBegin(dsl => dsl.Grid().Init())
                      .OnSuccess(dsl => dsl.Grid().AppendData(HttpUtility.HtmlEncode(json)));
        }
    }

    public class SignalR : IGridDataSource
    {
        public string Method { get; set; }

        public int ChunkSize { get; set; } = 50;

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnStart { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnComplete { get; set; }

        public Action<IIncodingMetaLanguageCallbackBodyDsl> OnError { get; set; }

        public JqueryBind Event { get; set; }

        public Selector Params { get; set; }

        public IIncodingMetaLanguageEventBuilderDsl Bind(IIncodingMetaLanguageEventBuilderDsl iml)
        {
            return iml.When(Bindings.Grid.DataSourceInit)
                      .OnSuccess(dsl => dsl.Self().JQuery.PlugIn("signalrLoader",
                                                                 new
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
                      .StopPropagation()
                      .OnBegin(dsl => dsl.Grid().Init())
                      .OnSuccess(dsl => dsl.Grid().StartWebsocket(Params));
        }
    }

    private static readonly string InitIncoding = JqueryBind.InitIncoding.ToStringLower();

    private static string PrepareEvents(JqueryBind? events)
    {
        if (!events.HasValue)
            return Bindings.Grid.DataSourceInit;

        var eventsAsString = events.ToJqueryString();

        if (events.Value.HasFlag(JqueryBind.InitIncoding))
            eventsAsString = eventsAsString.Replace(InitIncoding, Bindings.Grid.DataSourceInit);

        return eventsAsString;
    }
}
