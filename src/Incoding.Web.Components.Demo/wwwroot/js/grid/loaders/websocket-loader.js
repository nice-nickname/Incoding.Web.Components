
class WebsocketLoader {

    /**
     * @type { SplitGridController }
     */
    splitGrid

    /**
     * @type { any[] }
     */
    data = []

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

    signalrStream

    constructor(method, options) {
        const {
            chunkSize,
        } = options

        this.chunkSize = chunkSize
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

    startLoading() {
        this.cancelLoading()

        this.triggerStart()

        this.signalrStream = signalrController.connection
            .stream(this.method)
            .subscribe({
                next: (data) => {
                    this.triggerLoad(data.Items)
                },
                complete: () => {
                    this.triggerComplete()
                },
                error: (err) => {
                    console.error('websocket-loader', err)
                }
            })

        this.$root.trigger('load-start')
    }

    triggerStart() {
        this.$root.trigger('websocket-start')
    }

    triggerLoad(data) {
        this.splitGrid.appendData(data)

        this.$root.trigger('websocket-load-chunk', {
            data: data.Items
        })
    }

    triggerComplete() {
        this.$root.trigger('websocket-complete')
    }
}
