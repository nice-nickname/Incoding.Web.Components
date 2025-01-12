
/**
 * @implements { IRowRenderStrategy }
 */
class RenderingStrategy {

    /** @type { SplitTable } */
    splitTable

    /** @type { number } */
    #renderedIndex

    constructor(splitTable) {
        this.splitTable = splitTable;

        this.reset()
    }

    handleDataChanged() {
        const dataSource = this.splitTable.dataSource

        const start = this.#renderedIndex
        const end = dataSource.getData().length

        const data = dataSource.getData().slice(start, end)

        this.splitTable.appendRows(data)

        this.#renderedIndex = end
    }

    reset() {
        this.#renderedIndex = 0
    }
}
