
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
     * @type { InfitniteScrollOptions }
     */
    options


    /**
     * @type { HTMLElement }
     */
    scroller

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

    constructor(scroller, options, binding) {
        this.binding = binding
        this.options = options
        this.scroller = scroller

        this.scroller.addEventListener('scroll', this.#handleScroll)

        this.reset()
    }

    #handleScroll = (ev) => {
        const scroller = this.scroller
        if (!$(scroller).isScrollable()) return

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
        this.#chunkSize = this.options.chunkSize

        this.#availableChunks = this.#getAvailableChunks()

        this.#nextChunkRequested = true
    }

    handleDataChanged() {
        this.#availableChunks = this.#getAvailableChunks()

        this.requestRender();
    }

    requestRender() {
        if (!this.#nextChunkRequested) {
            return
        }

        this.tryRenderNextChunk();

        if (!$(this.scroller).isScrollable() && !this.#nextChunkRequested) {
            this.#nextChunkRequested = true

            this.requestRender()
        }
    }

    tryRenderNextChunk() {
        const chunk = this.#currentChunk;

        if (chunk >= this.#availableChunks) {
            return
        }

        const start = chunk * this.#chunkSize;
        const end = start + this.#chunkSize;

        this.binding.appendChunk(start, end);

        this.#nextChunkRequested = false;
        this.#currentChunk++;
    }

    #getAvailableChunks() {
        const availableChunks = this.binding.getData().length / this.#chunkSize

        return this.binding.isDataLoading() ?
            Math.floor(availableChunks) :
            Math.ceil(availableChunks)
    }
}
