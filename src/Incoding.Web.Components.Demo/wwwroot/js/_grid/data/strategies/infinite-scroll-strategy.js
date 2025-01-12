
/**
 * @implements { IRowRenderStrategy }
 */
class InfiniteScrollStrategy {

    /** @type { SplitTable } */
    splitTable

    /** @type { HTMLElement } */
    scroller

    /** @type { IInfitniteScrollOptions } */
    options


    #prevScrollTop = 0

    #currentChunk = 0
    #availableChunks = 0

    #nextChunkRequested = true


    constructor(splitTable, options, scrollElement) {
        this.splitTable = splitTable;
        this.scroller = scrollElement;
        this.options = options;

        this.scroller.addEventListener('scroll', this.#handleScroll)
    }

    handleDataChanged() {
        this.requestRender()
    }

    reset() {
        this.#prevScrollTop = 0
        this.#currentChunk = 0

        this.#nextChunkRequested = true
    }

    requestRender() {
        if (!this.#nextChunkRequested) {
            return
        }

        this.tryRenderNextChunk()

        if (!this.#isScrollable() && !this.#nextChunkRequested) {
            this.#nextChunkRequested = true

            this.requestRender()
        }
    }

    tryRenderNextChunk() {
        const chunk = this.#currentChunk

        if (chunk >= this.#getAvailableChunks()) {
            return
        }

        const start = chunk * this.options.chunkSize
        const end = start + this.options.chunkSize

        const data = this.splitTable.dataSource
            .getData()
            .slice(start, end)


        this.splitTable.appendRows(data)


        this.#nextChunkRequested = false
        this.#currentChunk++
    }

    #getAvailableChunks() {
        const dataSource = this.splitTable.dataSource

        const availableChunks = dataSource.getData().length / this.options.chunkSize

        return dataSource.isDataLoading
            ? Math.floor(availableChunks)
            : Math.ceil(availableChunks)
    }

    #isScrollable() {
        return $(this.scroller).isScrollable()
    }

    #handleScroll = (ev) => {
        if (!this.#isScrollable()) {
            return
        }

        const { scrollTop, scrollHeight, clientHeight } = this.scroller

        const scrollSize = scrollHeight - clientHeight - scrollTop

        const hasScrollerDown = scrollTop >= this.#prevScrollTop
        const isScrollNearBottom = scrollSize < InfiniteScrollStrategy.SCROLL_AT_BOTTOM_OFFSET

        this.#prevScrollTop = scrollTop

        this.#nextChunkRequested = hasScrollerDown && isScrollNearBottom
        this.requestRender()
    }

    static SCROLL_AT_BOTTOM_OFFSET = 50
}
