class InfiniteScrollRenderer {

    /**
     * @type { JQuery<HTMLElement> }
     */
    $scroller

    /**
     * @type { SplitGridController }
     */
    splitGrid;

    /**
     * @type { number }
     */
    chunkSize;

    /**
     * @type { number }
     */
    currentChunk;

    /**
     * @type { number }
     */
    availableChunks;

    /**
     * @type { boolean }
     */
    nextChunkRequested = true;

    /**
     * @type { number }
     */
    prevScrollTop;

    constructor(splitGrid, chunkSize) {
        this.splitGrid = splitGrid;
        this.chunkSize = chunkSize;

        const $scroller = this.splitGrid.$scroller.first()

        $scroller.on('scroll', () => this.handleScroll($scroller))

        this.restart()
    }

    handleDataUpdated() {
        this.availableChunks = this.#getAvailableChunks()

        this.requestRender();
    }

    restart() {
        this.splitGrid.disableScroll()
        this.splitGrid.resetScroll()

        this.currentChunk = 0
        this.availableChunks = this.#getAvailableChunks()

        this.nextChunkRequested = true
    }

    handleScroll($scroller) {
        const el = $scroller[0];
        const containerScroll = el.scrollHeight - el.clientHeight;

        const hasScrolledDown = el.scrollTop >= this.prevScrollTop;
        const isScrollNearBottom = containerScroll - el.scrollTop < 50;

        this.prevScrollTop = el.scrollTop;

        this.nextChunkRequested = hasScrolledDown && isScrollNearBottom;

        this.requestRender();
    }

    requestRender() {
        if (!this.nextChunkRequested && this.currentChunk !== 0) {
            return
        }

        this.splitGrid.scrolledToEnd = (this.currentChunk + 1) >= this.availableChunks

        this.tryRenderNextChunk();

        if (this.currentChunk === 1) {
            this.splitGrid.enableScroll()
        }

        if (!this.splitGrid.isScrollable() && this.availableChunks > this.currentChunk) {
            this.nextChunkRequested = true

            this.requestRender()
        }
    }

    tryRenderNextChunk() {
        const chunk = this.currentChunk;

        if (chunk >= this.availableChunks) {
            return
        }

        const start = chunk * this.chunkSize;
        const end = start + this.chunkSize;

        this.splitGrid.renderRows(start, end);

        this.nextChunkRequested = false;
        this.currentChunk++;
    }

    #getAvailableChunks() {
        const availableChunks = this.splitGrid.data.length / this.chunkSize

        return this.splitGrid.dataLoading
            ? Math.floor(availableChunks)
            : Math.ceil(availableChunks)
    }

}
