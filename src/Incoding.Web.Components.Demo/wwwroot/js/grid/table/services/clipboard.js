
class ClipboardService {

    /**
     * @type { SplitTable }
     */
    #table

    constructor(table) {
        this.#table = table
    }

    async copyRow(data, withHeading = false) {
        let result = ''
        if (withHeading) {
            result += this.#getHeaderRows()
        }
        result += this.#getDataRow(data)

        await this.#copy(result)
    }

    async #copy(str) {
        await navigator.clipboard.writeText(str)
    }

    #getHeaderRows() {
        const columns = this.#table.columns
        const maxDepth = this.#getMaxDepth(columns)

        let result = ''
        for (let i = 0; i < maxDepth; i++) {
            result += this.#getHeaderRow(columns, i) + '\n'
        }

        return result
    }

    /**
     * @param { Column[] } columns
     */
    #getMaxDepth(columns) {
        let maxDepth = 1
        for (const column of columns) {
            if (column.stacked.length > 0) {
                maxDepth = Math.max(maxDepth, 1 + this.#getMaxDepth(column.stacked))
            }
        }
        return maxDepth
}

    /**
     * @param { Column[] } columns
     * @param { number } depth
     */
    #getHeaderRow(columns, depth) {
        let row = ''
        for (const column of columns) {
            if (column.isControlColumn()) continue

            if (depth === 0) {
                row += column.title + '\t'
                if (column.isStacked()) {
                    row += '\t'.repeat(column.stacked.length - 1)
                }
            } else if (column.isStacked()) {
                row += this.#getHeaderRow(column.stacked, depth - 1)
            } else {
                row += '\t'
            }
        }
        return row
    }

    /**
     * @param { object } data
     */
    #getDataRow(data) {
        const columns = this.#table.getFlatColumns()
            .filter(column => column.field)

        return columns
                .map(column => column.formatToString(column.getValue(data)))
                .join('\t')
    }
}
