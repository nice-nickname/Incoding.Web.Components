
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
        this.table.schema.rename(column.uid, name)
        this.table.refreshHeader()
    }

    /**
     * @param { Column } column
     */
    pin(column) {
        if (this.table.getPinnedColumns().length === 0) {
            this.#setPinToControlColumns(true)
        }

        this.table.schema.pinColumn(column.uid, true)
        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { Column } until
     */
    pinUntil(until) {
        const columns = this.table.columns
            .filter(column => column.index <= until.index && !column.isPinned)

        for (const column of columns) {
            this.table.schema.pinColumn(column.uid, true)
        }
        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { Column } column
     */
    unpin(column) {
        this.table.schema.pinColumn(column.uid, false)

        if (this.#shouldUnpinControlColumns()) {
            this.#setPinToControlColumns(false)
        }
        this.table.dataBinding.schemaUpdated()
    }

    unpinAll() {
        const pinned = this.table.columns
            .filter(column => column.isPinned)

        pinned.forEach((column) => {
            this.table.schema.pinColumn(column.uid, false)
        })

        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { Column } column
     */
    moveToStart(column) {
        this.table.schema.moveColumn(column.uid, 'first')
        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { Column } column
     */
    moveToEnd(column) {
        this.table.schema.moveColumn(column.uid, 'last')
        this.table.dataBinding.schemaUpdated()
    }


    /**
     * @param { Column } column
     * @param { Column } beforeColumn
     */
    moveBefore(column, beforeColumn) {
        this.table.schema.moveColumn(column.uid, beforeColumn.uid)
        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { Column } column
     */
    remove(column) {
        this.table.schema.remove(column.uid)

        if (this.#shouldUnpinControlColumns()) {
            this.#setPinToControlColumns(false)
        }

        this.table.dataBinding.schemaUpdated()
    }

    /**
     * @param { boolean } value
     */
    #setPinToControlColumns(value) {
        const controlColumns = this.table.columns
            .filter(column => column.isControlColumn())

        for (const column of controlColumns) {
            this.table.schema.pinColumn(column.uid, value)
        }
    }

    #shouldUnpinControlColumns() {
        const pinned = this.table.columns
            .filter(column => column.isPinned)

        let regularPinned = 0
        let controlsPinned = 0
        for (const column of pinned) {
            column.isControlColumn() ?
                controlsPinned++ :
                regularPinned++
        }

        return regularPinned === 0 && controlsPinned !== 0
    }
}
