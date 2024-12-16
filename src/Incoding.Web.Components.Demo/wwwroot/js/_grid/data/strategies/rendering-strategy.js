
/**
 * @implements { IRowRenderStrategy }
 */
class RenderingStrategy {

    /** @type { DataSource } */
    dataSource

    /** @type { number } */
    #renderedIndex

    constructor(dataSource) {
        this.dataSource = dataSource;

        this.reset()
    }


    renderRows() {
        const start = this.#renderedIndex
        const end = this.dataSource.getData().length

        const data = this.dataSource
            .getData()
            .slice(start, end)

        // ...

        this.#renderedIndex = end
    }

    reset() {
        this.#renderedIndex = 0
    }
}
