class InfiniteScrollRenderer {

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
        this.currentChunk = 0

        this.nextChunkRequested = true

        const handleScroll = this.handleScroll.bind(this);

        this.splitGrid.$scroller.first().on('scroll', handleScroll);
    }

    handleDataUpdated() {
        this.availableChunks = Math.floor(this.splitGrid.data.length / this.chunkSize);

        this.requestRender();
    }

    handleScroll() {
        const el = this.splitGrid.$scroller[0];
        const containerScroll = el.scrollHeight - el.clientHeight;

        const hasScrolledDown = el.scrollTop >= this.prevScrollTop;
        const isScrollNearBottom = containerScroll - el.scrollTop < 50;

        this.prevScrollTop = el.scrollTop;

        this.nextChunkRequested = hasScrolledDown && isScrollNearBottom;

        this.requestRender();
    }

    requestRender() {
        if (this.nextChunkRequested) {
            this.tryRenderNextChunk();
        }
    }

    tryRenderNextChunk() {
        const chunk = this.currentChunk;

        if (chunk >= this.availableChunks) return;

        const start = chunk * this.chunkSize;
        const end = start + this.chunkSize;

        this.splitGrid.renderRows(start, end);

        this.nextChunkRequested = false;
        this.currentChunk++;
    }
}
