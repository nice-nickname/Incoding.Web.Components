
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
        column.isPinned = true
        const position = this.#getPinPosition()

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
        const startPos = this.#getFirtsAvailableColumnPosition()
        this.#reorderColumns(column, startPos)
    }

    /**
     * @param { Column } column
     */
    moveToEnd(column) {
        const endPos = this.table.columns.length - 1
        this.#reorderColumns(column, endPos)
    }


    /**
     * @param { Column } column
     * @param { string } beforeUid
     */
    moveBefore(column, beforeUid) {
        const position = this.#getColumnPosition(beforeUid)

        this.#reorderColumns(column, position)
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

    #reorderColumns(columns, to) {
        const from = this.table.columns.indexOf(columns)

        if (from === to) {
            return
        }

        this.table.columns.splice(
            to,
            0,
            this.table.columns.splice(from, 1)[0]
        )

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
