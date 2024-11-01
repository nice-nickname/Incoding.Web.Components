
function initializeSplitGrid(options) {
    const grid = new SplitGrid(JSON.parse(options))
    grid.render()
};

(function($) {

    $.fn.isScrollable = function(axis = 'vertical') {
        const {
            scroll,
            client
        } = axis === 'vertical' ?
            { scroll: this[0].scrollHeight, client: this[0].clientHeight } :
            { scroll: this[0].scrollWidth, client: this[0].clientWidth }

        return scroll > client
    }

} (jQuery));

(function($) {

    const retryDelaysInMilliseconds  = [
        0, 10, 60, 60, 60, 60, 60, 60, 60, 60
    ].map(seconds => seconds * 1000)

    const signalrConnections = { }

    $.fn.signalr = function (action) {
        if (signalrConnections[action]) {
            return signalrConnections[action]
        }

        let builder = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect(retryDelaysInMilliseconds)
            .withUrl(action)
            .configureLogging(signalR.LogLevel.Information)

        const connection = builder.build()

        connection.start().catch(console.error)
        signalrConnections[action] = connection

        return signalrConnections[action]
    }

    $.fn.signalrLoader = function(options) {
        const loader = new SignalRLoader(this[0], options)

        $(this).data('loader', loader)
    }

    $.fn.signalr("/signals")

} (jQuery))
