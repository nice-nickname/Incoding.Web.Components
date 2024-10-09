
class DataBinding {

    /**
     * @type { object[] }
     */
    #data

    /**
     * @type { SplitTable[] }
     */
    #tables

    /**
     * @type { boolean }
     */
    #isDataLoading

    /**
     * @type { RenderingBehaviour }
     */
    #renderer

    constructor() {
        this.#tables = []
        this.#data = []

        this.#isDataLoading = false
    }


    setRenderer(renderer) {
        this.#renderer = renderer
    }

    addTable(table) {
        this.#tables.push(table)
    }

    unbind() {
        this.#data = []

        for (const table of this.#tables) {
            table.removeRows()

            if (this.#isDataLoading) {
                table.appendPlaceholderRows()
            }
        }

        this.#renderer.reset()
    }

    /**
     * @param { object[] } data
     */
    appendData(data) {
        this.#data.push(...data)

        this.#renderer.handleDataChanged()
    }

    /**
     * @param { number } start
     * @param { number } end
     */
    appendChunk(start, end) {
        const chunk = this.#data.slice(start, end)

        for (const table of this.#tables) {
            table.appendRows(chunk)

            if (this.#isDataLoading) {
                table.appendPlaceholderRows()
                table.setFooterLoading()
            } else {
                table.updateTotals()
            }
        }
    }

    schemaUpdated() {
        this.#renderer.reset()

        for (const table of this.#tables) {
            table.header.render()
            table.footer.render()
            table.colGroup.render()

            table.removeRows()
        }

        this.#renderer.handleDataChanged()
    }

    dataUpdated() {
        this.#renderer.reset()

        for (const table of this.#tables) {
            table.removeRows()
        }

        this.#renderer.handleDataChanged()
    }

    totalsUpdated() {
        for (const table of this.#tables) {
            table.removePlaceholders()
            table.updateTotals()
        }
    }

    setDataLoading(value) {
        this.#isDataLoading = value

        if (!value) {
            this.totalsUpdated()
        }
    }

    isDataLoading() {
        return this.#isDataLoading
    }

    getData() {
        return this.#data
    }

    getTables() {
        return this.#tables
    }
}
