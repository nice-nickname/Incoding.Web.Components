
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
        this.table.header.render()
    }

    /**
     * @param { Column } column
     */
    pin(column) {
        this.table.schema.pinColumn(column.uid, true)
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }

    /**
     * @param { Column } column
     */
    unpin(column) {
        this.table.schema.pinColumn(column.uid, false)
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }

    /**
     * @param { Column } column
     */
    moveToStart(column) {
        this.table.schema.moveColumn(column.uid, 'first')
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }

    /**
     * @param { Column } column
     */
    moveToEnd(column) {
        this.table.schema.moveColumn(column.uid, 'last')
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }


    /**
     * @param { Column } column
     * @param { Column } beforeColumn
     */
    moveBefore(column, beforeColumn) {
        this.table.schema.moveColumn(column.uid, beforeColumn.uid)
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }

    /**
     * @param { Column } column
     */
    remove(column) {
        this.table.schema.remove(column.uid)
        this.table.dataBinding.schemaUpdated()
        this.#notifyColumnUpdated(column)
    }

    #notifyColumnUpdated(column) {
        this.table.columnChanged(column)
    }
}
