
class WebsocketLoader {

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
    }

    cancelLoading() {
        if (this.signalrStream) {
            this.signalrStream.dispose()
        }
    }

    startLoading(params) {
        this.cancelLoading()

        this.triggerStart()

        this.signalrStream = this.signalrConnection
            .stream(this.method, { ChunkSize: this.chunkSize, QueryParams: params })
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

        this.$root.trigger('websocket-started')
    }

    triggerLoad(data) {
        this.splitGrid.appendData(data)

        this.$root.trigger('websocket-load-chunk', {
            data: data.Items
        })
    }

    triggerComplete() {
        this.splitGrid.dataLoading = false

        this.$root.trigger('websocket-completed')
    }

    triggerError(err) {
        this.$root.trigger('websocket-error')
        console.error('websocket-loader', err)
    }
}
