
/**
 * @implements { IRowRenderStrategy }
 */
class RenderingStrategy {

    /** @type { SplitTable } */
    splitTable

    /** @type { DataSource } */
    dataSource

    /** @type { number } */
    #renderedIndex

    constructor(splitTable) {
        this.splitTable = splitTable;
        this.dataSource = splitTable.dataSource;

        this.reset()
    }

    handleDataChanged() {
        const start = this.#renderedIndex
        const end = this.dataSource.getData().length

        const data = this.dataSource
            .getData()
            .slice(start, end)

        this.splitTable.appendRows(data)

        this.#renderedIndex = end
    }

    reset() {
        this.#renderedIndex = 0
    }
}
