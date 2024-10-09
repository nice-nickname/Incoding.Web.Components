
class ImmediateRenderingBehaviour {

    /**
     * @type { SplitGrid }
     */
    grid

    /**
     * @type { number }
     */
    #renderedIndex

    constructor(grid) {
        this.grid = grid

        this.#renderedIndex = 0
    }

    handleDataChanged() {
        const dataBinding = this.grid.dataBinding

        const start = this.#renderedIndex
        const end = dataBinding.data.length

        dataBinding.appendRows(start, end)

        this.#renderedIndex = dataBinding.data.length
    }

    reset() {
        this.#renderedIndex = 0
    }
}
