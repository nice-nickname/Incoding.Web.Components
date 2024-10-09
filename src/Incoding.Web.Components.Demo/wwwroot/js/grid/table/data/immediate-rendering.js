
class ImmediateRenderingBehaviour {

    /**
     * @type { DataBinding }
     */
    #binding

    /**
     * @type { number }
     */
    #renderedIndex

    constructor(bindign) {
        this.#binding = bindign

        this.#renderedIndex = 0
    }

    handleDataChanged() {
        const binding = this.#binding

        const start = this.#renderedIndex
        const end = binding.getData().length

        binding.appendChunk(start, end)

        this.#renderedIndex = binding.getData().length
    }

    reset() {
        this.#renderedIndex = 0
    }
}
