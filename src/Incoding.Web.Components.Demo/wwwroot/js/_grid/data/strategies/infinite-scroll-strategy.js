
/**
 * @implements { IRowRenderStrategy }
 */
class InfiniteScrollStrategy {

    /** @type { DataSource } */
    dataSource

    /** @type { HTMLElement } */
    scroller

    /** @type { IInfitniteScrollOptions } */
    options


    /** @type { number } */
    #prevScrollTop = 0

    /** @type { number } */
    #currentChunk = 0

    /** @type { number } */
    #availableChunks = 0

    /** @type { boolean } */
    #nextChunkRequested = false


    constructor(dataSource, options, scrollElement) {
        this.dataSource = dataSource;
        this.scroller = scrollElement;
        this.options = options;

        this.scroller.addEventListener('scroll', this.#handleScroll)
    }

    renderRows() {
        this.#availableChunks = this.#getAvailableChunks()

        this.requestRender()
    }

    reset() {
        this.#prevScrollTop = 0
        this.#currentChunk = 0
        this.#availableChunks = this.#getAvailableChunks()

        this.nextChunkRequested = true
    }

    requestRender() {
        if (!this.#nextChunkRequested) {
            return
        }

        this.tryRenderNextChunk()

        if (!this.#isScrollable() && !this.nextChunkRequested) {
            this.nextChunkRequested = true

            this.requestRender()
        }
    }

    tryRenderNextChunk() {
        const chunk = this.#currentChunk

        if (chunk >= this.#availableChunks) {
            return
        }

        const start = chunk * this.options.chunkSize
        const end = start + this.options.chunkSize

        // ...

        this.#nextChunkRequested = false
        this.#currentChunk++
    }

    #getAvailableChunks() {
        const availableChunks = this.dataSource.getData().length / this.options.chunkSize

        return this.dataSource.isDataLoading
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

        const {
            scrollTop, scrollHeight, clientHeight
        } = this.scroller

        const scrollSize = scrollHeight - clientHeight - scrollTop

        const hasScrollerDown = scrollTop >= this.#prevScrollTop
        const isScrollNearBottom = scrollSize < InfiniteScrollStrategy.SCROLL_AT_BOTTOM_OFFSET

        this.#nextChunkRequested = hasScrollerDown && isScrollNearBottom
    }

    static SCROLL_AT_BOTTOM_OFFSET = 50
}
