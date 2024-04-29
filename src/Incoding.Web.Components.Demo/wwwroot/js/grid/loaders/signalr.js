(function ($) {

    const retryDelaysInMilliseconds  = [
        0, 10, 60, 60, 60, 60, 60, 60, 60, 60
    ].map(seconds => seconds * 1000)

    $.fn.signalr = function (action) {
        if (window.signalrConnection) return

        let builder = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect(retryDelaysInMilliseconds)
            .withUrl(action)

        if (ExecutableBase.IsDebug) {
            builder.configureLogging(signalR.LogLevel.Information)
        }

        const connection = builder.build()

        connection.start().catch(console.error)

        window.signalrConnection = connection
    }

}(jQuery));
