
class ColumnEdit {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table
    }

    /**
     * @param { Column } column
     * @param { string } name
     */
    rename(column, name) {
        column.title = name

        this.table.header.render()
    }

    /**
     * @param { Column } column
     */
    pin(column) {
        const position = this.#getPinPosition()

        column.isPinned = true
        this.#reorderColumns(column, position)
    }

    /**
     * @param { Column } column
     */
    unpin(column) {
        const position = this.#getFirtsAvailableColumnPosition()

        column.isPinned = false
        this.#reorderColumns(column, position - 1)
    }

    /**
     * @param { Column } column
     */
    moveToStart(column) {
        this.#reorderColumns(column, 'first')
    }

    /**
     * @param { Column } column
     */
    moveToEnd(column) {
        this.#reorderColumns(column, 'last')
    }


    /**
     * @param { Column } column
     * @param { Column } beforeColumn
     */
    moveBefore(column, beforeColumn) {
        this.#reorderColumns(column, beforeColumn)
    }

    /**
     * @param { Column } column
     */
    remove(column) {
        if (column.hasStackedParent()) {
            const parent = this.table.getColumn(column.parentUid)

            parent.stacked.splice(
                parent.stacked.indexOf(column), 1
            )

            if (parent.stacked.length === 1) {
                const parentIndex = this.#getColumnPosition(column.parentUid)
                this.table.columns[parentIndex] = parent.stacked[0]
                parent.stacked[0].parentUid = null
            }

        } else {
            this.table.columns.splice(
                this.table.columns.indexOf(column), 1
            )
        }

        this.table.dataBinding.schemaUpdated()
    }

    /**
     *
     * @param { Column } column
     * @param { "first" | "last" | Column | number } to
     * @returns
     */
    #reorderColumns(column, to) {
        const columns = this.table.columns

        let toPos = -1
        const result = [...columns.filter(s => s.uid !== column.uid)]
        if (typeof to === 'object') {
            toPos = result.findIndex(col => col.uid === to.uid)
        }

        if (typeof to === 'string') {
            toPos = to === 'first' ? this.#getFirtsAvailableColumnPosition() : result.length
        }

        if (typeof to === 'number') {
            toPos = to
        }

        result.splice(toPos, 0, column)

        this.table.columns = result

        this.table.dataBinding.schemaUpdated()
    }

    #getFirtsAvailableColumnPosition() {
        for (let i = 0; i < this.table.columns.length; i++) {
            const column = this.table.columns[i];
            if (column.isPinned || column.isSpecialColumn()) continue;

            return i
        }
    }

    #getPinPosition() {
        for (let i = 0; i < this.table.columns.length; i++) {
            const column = this.table.columns[i];
            if (column.isPinned) continue;

            return i
        }
    }

    #getColumnPosition(uid) {
        const columns = this.table.columns

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.uid === uid) {
               return i
            }
        }
    }
}
