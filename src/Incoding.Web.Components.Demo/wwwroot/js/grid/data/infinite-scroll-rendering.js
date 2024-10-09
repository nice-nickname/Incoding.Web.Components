
class InfitniteScrollRenderingBehaviour {

    /**
     * @type { SplitGrid }
     */
    grid

    /**
     * @type { DataBinding }
     */
    binding


    /**
     * @type { HTMLElement }
     */
    #scroller

    /**
     * @type { number }
     */
    #prevScrollTop = 0

    /**
     * @type { boolean }
     */
    #nextChunkRequested

    /**
     * @type { number }
     */
    #currentChunk

    /**
     * @type { number }
     */
    #chunkSize

    /**
     * @type { number }
     */
    #availableChunks

    constructor(grid, binding) {
        this.grid = grid
        this.binding = binding

        this.#scroller = this.grid.splitter.panelElements[0]
        this.#scroller.addEventListener('scroll', this.#handleScroll)

        this.reset()
    }

    #handleScroll = (ev) => {
        const scroller = this.#scroller

        const containerScroll = scroller.scrollHeight - scroller.clientHeight;

        const hasScrolledDown = scroller.scrollTop >= this.#prevScrollTop;
        const isScrollNearBottom = containerScroll - scroller.scrollTop < 50;

        this.#prevScrollTop = scroller.scrollTop;

        this.#nextChunkRequested = hasScrolledDown && isScrollNearBottom;

        this.requestRender();
    }

    reset() {
        this.#currentChunk = 0
        this.#prevScrollTop = 0
        this.#chunkSize = this.grid.infiniteScroll.chunkSize

        this.#availableChunks = this.#getAvailableChunks()

        this.#nextChunkRequested = true
    }

    handleDataChanged() {
        this.#availableChunks = this.#getAvailableChunks()

        this.requestRender();
    }

    requestRender() {
        if (!this.#nextChunkRequested && this.#currentChunk !== 0) {
            return
        }

        // this.grid.scrolledToEnd = this.#isScrolledToEnd()

        this.tryRenderNextChunk();

        if (this.#currentChunk === 1) {
            // this.splitGrid.enableScroll()
        }


        // if (/*!this.splitGrid.isScrollable() && */this.#availableChunks > this.#currentChunk) {
        //     this.#nextChunkRequested = true

        //     this.requestRender()
        // }
    }

    tryRenderNextChunk() {
        const chunk = this.#currentChunk;

        if (chunk >= this.#availableChunks) {
            return
        }

        const start = chunk * this.#chunkSize;
        const end = start + this.#chunkSize;

        this.binding.appendRows(start, end);

        this.#nextChunkRequested = false;
        this.#currentChunk++;
    }

    #getAvailableChunks() {
        const availableChunks = this.binding.data.length / this.#chunkSize

        return Math.ceil(availableChunks)

        // return this.splitGrid.dataLoading
        //     ? Math.floor(availableChunks)
        //     : Math.ceil(availableChunks)
    }

    // #isScrolledToEnd() {
    //     return (this.#currentChunk + 1) >= this.#availableChunks
    // }
}
