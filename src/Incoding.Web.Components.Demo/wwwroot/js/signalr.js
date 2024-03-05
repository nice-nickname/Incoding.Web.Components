(function ($) {

    $.fn.signalr = function (action) {
        if (window.signalrConnection) return


        let builder = new signalR.HubConnectionBuilder().withUrl(action)

        if (ExecutableBase.IsDebug) {
            builder.configureLogging(signalR.LogLevel.Information)
        }

        const connection = builder.build()


        connection.on("signal", handleSignal);

        connection.start().catch(console.error)

        window.signalrConnection = connection
    }

    function handleSignal(data) {
        let eventType = data.EventType
        $('[name=SignalHub]').trigger(eventType.toLowerCase(), data)
    }

}(jQuery));
