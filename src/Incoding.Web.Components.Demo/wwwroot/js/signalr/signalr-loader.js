
class SignalRLoader {

    connection

    #stream

    /**
     * @type { "started" | "stopped" }
     */
    #streamStatus

    /**
     * @type { string }
     */
    #method

    /**
     * @type { number }
     */
    #chunkSize

    /**
     * @type { SplitGrid }
     */
    #splitGrid

    /**
     * @type { DataBinding }
     */
    #dataBinding

    /**
     * @type { HTMLElement }
     */
    #root

    constructor(el, options) {
        this.#root = el
        this.#streamStatus = "stopped"

        this.#method = options.method
        this.#chunkSize = options.chunkSize

        this.#splitGrid = $(el).data('splitGrid')
        this.#dataBinding = this.#splitGrid.rootBinding

        this.connection = $.fn.signalr("/grid")
    }

    start(params) {
        if (this.#streamStatus === "started") {
            this.cancel()
        }

        params = _.isString(params || {}) ? JSON.parse(params) : params

        this.#onStart()

        this.#stream = this.connection
            .stream(this.#method, { ChunkSize: this.#chunkSize, Query: params })
            .subscribe({
                next: (data) => {
                    if (!data.IsNext) {
                        this.#onComplete()
                    }

                    this.#onDataChunk(data)
                },
                error: (err) => {
                    this.#onError(err)
                },
                complete: () => {

                }
            })

        this.#streamStatus = "started"
    }

    cancel() {
        this.#stream?.dispose()
        this.#streamStatus = "stopped"
    }

    #onStart = () => {
        this.#dataBinding.setDataLoading(true)
        this.#splitGrid.clearData()
        this.#splitGrid.show()

        this.#root.dispatchEvent(new Event(events.signalr.start))
    }

    #onDataChunk = (data) => {
        this.#dataBinding.appendData(data.Items)
    }

    #onError = (error) => {
        console.error(error)

        this.#dataBinding.setDataLoading(false)
        this.#root.dispatchEvent(new Event(events.signalr.error))
        this.#streamStatus = "stopped"
    }

    #onComplete = () => {
        this.#dataBinding.setDataLoading(false)

        this.#root.dispatchEvent(new Event(events.signalr.complete))
        this.#streamStatus = "stopped"
    }
}
