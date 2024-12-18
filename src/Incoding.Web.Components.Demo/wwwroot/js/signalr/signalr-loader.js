
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
     * @type { SplitTable }
     */
    #splitTable

    /**
     * @type { DataSource }
     */
    #dataSource


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
        this.#splitTable = this.#splitGrid.splitTable
        this.#dataSource = this.#splitTable.dataSource

        this.connection = $.fn.signalr("/signals")
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
                    this.#onDataChunk(data)

                    if (!data.IsNext) {
                        this.#onComplete()
                    }
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
        this.#dataSource.isDataLoading = true

        this.#splitGrid.clearData()
        this.#splitGrid.show()

        this.#splitTable.contentRenderer.hideNoRows()
        this.#splitTable.contentRenderer.showLoadingRows()

        this.#root.dispatchEvent(new Event(events.signalr.start))
    }

    #onDataChunk = (data) => {
        this.#splitTable.contentRenderer.hideLoadingRows()
        this.#splitGrid.appendData(data.Items)
        this.#splitTable.contentRenderer.showLoadingRows()
    }

    #onError = (error) => {
        console.error(error)

        this.#dataSource.isDataLoading = false

        this.#root.dispatchEvent(new Event(events.signalr.error))
        this.#streamStatus = "stopped"
    }

    #onComplete = () => {
        this.#dataSource.isDataLoading = false

        this.#splitTable.contentRenderer.hideLoadingRows()
        this.#splitTable.footerRenderer.render()

        this.#root.dispatchEvent(new Event(events.signalr.complete))
        this.#streamStatus = "stopped"
    }
}
