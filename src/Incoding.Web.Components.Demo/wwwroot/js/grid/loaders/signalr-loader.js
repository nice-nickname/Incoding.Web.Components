
class SignalrLoader {

    /**
     * @type { SplitGridController }
     */
    splitGrid

    /**
     * @type { number }
     */
    chunkSize

    /**
     * @type { JQuery<HTMLElement> }
     */
    $root

    /**
     * @type { string }
     */
    method

    signalrConnection

    signalrStream

    constructor(method, options) {
        if (!window.signalrConnection) {
            return console.error('SignalR connection not found')
        }

        this.signalrConnection = window.signalrConnection

        this.chunkSize = options.chunkSize
        this.method = method
    }

    initialize(element) {
        this.cancelLoading()

        this.$root = $(element)
        this.$scroll = this.$root.find(this.scroller).first()

        this.splitGrid = this.$root.data('splitGrid')

        this.splitGrid.dataLoading = false
    }

    cancelLoading() {
        if (this.signalrStream) {
            this.signalrStream.dispose()
        }
    }

    startLoading(params) {
        this.cancelLoading()

        this.triggerStart()

        params = _.isString(params || {}) ? JSON.parse(params) : params

        this.signalrStream = this.signalrConnection
            .stream(this.method, { ChunkSize: this.chunkSize, Query: params })
            .subscribe({
                next: (data) => {
                    if (!data.IsNext) {
                        this.triggerComplete()
                    }

                    this.triggerLoad(data.Items)
                },
                error: (err) => {
                    this.triggerError(err)
                },
                complete: () => {
                    this.triggerComplete()
                }
            })
    }

    triggerStart() {
        this.splitGrid.dataLoading = true

        this.splitGrid.initializeTables()
        this.splitGrid.disableSort()
        this.splitGrid.disableFilter()

        this.$root.trigger(events.signalr.start)
    }

    triggerLoad(data) {
        this.splitGrid.appendData(data)
    }

    triggerComplete() {
        this.splitGrid.dataLoading = false
        this.splitGrid.totals()
        this.splitGrid.enableSort()
        this.splitGrid.enableFilter()

        this.$root.trigger(events.signalr.complete)
    }

    triggerError(err) {
        this.$root.trigger(events.signalr.error)

        console.error('websocket-loader', err)
    }
}
