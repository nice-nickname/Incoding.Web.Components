

class WebsocketLoader {
    data = []

    chunkSize

    currentChunk = 0

    availableChunks = 0

    signalrStream

    $element

    $scroll

    nextChunkRequested = false

    hasMoreByChunk = []

    method = ''

    scroller

    constructor(method, options) {
        const {
            chunkSize,
            scroller
        } = options

        this.chunkSize = chunkSize
        this.method = method
        this.scroller = scroller
    }

    initialize(element) {
        this.cancelLoading()

        this.$element = $(element)
        this.$scroll = this.$element.find(this.scroller).first()

        this.initilizeScroll()
    }

    initilizeScroll() {
        let prevScrollTop = 0

        this.$element.on('mousewheel', () => {
            const el = this.$scroll[0]
            const containerScroll = el.scrollHeight - el.clientHeight

            const hasScrolledDown = el.scrollTop >= prevScrollTop
            const isScrollNearBottom = containerScroll - el.scrollTop < 50

            prevScrollTop = el.scrollTop

            this.nextChunkRequested = hasScrolledDown && isScrollNearBottom

            if (this.nextChunkRequested) {
                this.triggerRenderNextChunk()
            }
        })
    }

    cancelLoading() {
        if (this.signalrStream) {
            this.signalrStream.dispose()
        }
    }

    startLoading() {
        this.cancelLoading()

        this.triggerStart()

        this.currentChunk = 0
        this.availableChunks = 0
        this.nextChunkRequested = true
        this.hasMoreByChunk = []
        this.data = []

        this.signalrStream = signalrController.connection
            .stream(this.method)
            .subscribe({
                next: (data) => {
                    const items = data.Items

                    this.triggerLoad(data)

                    this.data.push(...items)
                    this.hasMoreByChunk[this.availableChunks] = data.IsNext

                    this.availableChunks++

                    if (this.nextChunkRequested) {
                        this.triggerRenderNextChunk()
                    }
                },
                complete: () => {
                    this.triggerComplete()
                },
                error: alert
            })

        this.$element.trigger('load-start')
    }

    triggerRenderNextChunk() {
        const chunk = this.currentChunk

        if (chunk >= this.availableChunks) return;

        const start = chunk * this.chunkSize
        const end = start + this.chunkSize

        this.$element.trigger('websocket-render-chunk', {
            start,
            end,
            hasMore: this.hasMoreByChunk[chunk]
        })

        this.nextChunkRequested = false
        this.currentChunk++
    }

    triggerRerender(newRowData) {
        const rowId = newRowData.RowId

        const rowIndex = this.data.findIndex(s => s.RowId == rowId)
        const rowData = this.data[rowIndex]

        this.data[rowIndex] = { ...rowData, ...newRowData }

        this.$element.trigger('rerender', {
            data: this.data[rowIndex],
            rowId
        })

        this.$element.trigger('render-children', {
            data: this.data[rowIndex].Children || []
        })
    }

    triggerStart() {
        this.$element.trigger('websocket-start')
    }

    triggerLoad(data) {
        this.$element.trigger('websocket-load-chunk', {
            data: data.Items
        })
    }

    triggerComplete() {
        this.$element.trigger('websocket-complete')
    }
}
