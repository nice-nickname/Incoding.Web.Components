
class TableSchema {

    /**
     * @type { string }
     */
    id

    /**
     * @type { string[] }
     */
    css

    /**
     * @type { Row }
     */
    row

    /**
     * @type { Column[] }
     */
    columns

    /**
     * @type { string }
     */
    nestedField

    /**
     * @type { TableSchema }
     */
    nested

    /**
     * @type { SplitTableSummaryModel }
     */
    summary

    /**
     * @type { GridMode }
     */
    mode


    /**
     * @param { SplitTableModel } table
     * @param { ServiceCollection } services
     */
    constructor(table, services, mode = GridMode.Stacked) {
        this.id = table.id
        this.css = SplitGridHelpers.parseCss(table.css)
        this.row = new Row(table.row)
        this.mode = mode

        const formatter = services.getService(FormatService.name)

        this.columns = table.columns
            .map(column => new Column(column, formatter))
            .filter(column => !column.hidden)

        this.summary = table.summary

        if (table.nestedField) {
            this.nestedField = table.nestedField
            this.nested = new TableSchema(table.nested, services, mode)
        }
    }

    /**
     * @param { string } uid
     * @param { boolean } value
     */
    pinColumn(uid, value) {
        const column = this.#getColumn(uid)

        const pinPosition = value ? this.#getPinPosition() : this.#getPositionByIndex(column.index) - 1

        column.setPin(value)
        if (this.#hasNestedAndSimple()) {
            this.nested.pinColumn(uid, value)
        }

        this.moveColumn(uid, pinPosition)
    }

    /**
     * @param { string } uid
     * @param { string } value
     */
    rename(uid, value) {
        const column = this.#getColumn(uid)
        column.title = value

        if (this.#hasNestedAndSimple()) {
            this.nested.rename(uid, value)
        }
    }

    /**
     * @param { string } uid
     * @param { boolean } value
     */
    remove(uid) {
        const column = this.#getColumn(uid)

        if (!column.hasStackedParent()) {
            this.columns.splice(this.columns.indexOf(column), 1)
            return
        }

        const parent = this.#getColumn(column.uid)

        parent.stacked.splice(
            parent.stacked.indexOf(column), 1)

        if (parent.stacked.length === 1) {
            const parentPosition = this.#getPositionByIndex(column.index)
            this.columns[parentPosition] = parent.stacked[0]
            parent.stacked[0].parentUid = null
        }

        if (this.#hasNestedAndSimple()) {
            this.nested.remove(uid)
        }
        this.#updateIndexes()
    }

    /**
     * @param { string } uid
     * @param { number } width
     */
    resizeColumn(uid, width) {
        const column = this.#getColumn(uid)
        column.width = Math.min(
            Math.max(width, column.minWidth),
            Column.defaultMaxWidth
        )

        if (this.#hasNestedAndSimple()) {
            this.nested.resizeColumn(uid, width)
        }
    }

    /**
     * @param { string } uid
     * @param { 'first' | 'last' | number } position
     */
    moveColumn(uid, position) {
        const targetColumn = this.#getColumn(uid)

        const columns = [...this.columns]
            .filter(c => c.uid !== targetColumn.uid)

        let positionIndex = -1
        if (typeof position === 'number') {
            positionIndex = position
        }

        if (position === 'first') {
            positionIndex = this.#getPositionByIndex(0)
        }

        if (position === 'last') {
            positionIndex = columns.length
        }

        if (typeof position === 'string' && positionIndex === -1) {
            positionIndex = columns.indexOf(this.#getColumn(position))
        }

        columns.splice(positionIndex, 0, targetColumn)

        this.columns = columns

        if (this.#hasNestedAndSimple()) {
            this.nested.moveColumn(uid, position)
        }
        this.#updateIndexes()
    }

    #hasNestedAndSimple() {
        return this.mode === GridMode.Stacked && this.nested
    }

    /**
     * @param { string } uid
     * @returns { Column }
     */
    #getColumn(uid) {
        const searchColumn = (columns, uid) => {
            for (const column of columns) {
                if (column.uid === uid) return column

                if (column.isStacked()) {
                    let stacked = searchColumn(column.stacked, uid)

                    if (stacked) {
                        return stacked
                    }
                }
            }

            return null
        }

        return searchColumn(this.columns, uid)
    }


    #getPinPosition() {
        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            if (column.isPinned) continue;

            return i
        }
        return 0
    }

    /**
     * @param { number } index
     * @returns { number }
     */
    #getPositionByIndex(index) {
        for (let pos = 0; pos < this.columns.length; pos++) {
            const column = this.columns[pos];
            if (column.isPinned || column.isControlColumn()) continue;

            if (column.index >= index) {
                return pos
            }
        }

        return this.columns.length - 1
    }

    /**
     * @param { Column[] | undefined } columns
     * @param { number } startIndex
     */
    #updateIndexes(columns = undefined, startIndex = 0) {
        columns = columns || this.columns

        const pinned = columns
            .filter(column => column.isPinned)
            .map(column => column.index)

        let index = startIndex
        for (const column of columns) {
            if (column.isPinned || column.isControlColumn()) continue;

            while (pinned.includes(index))
                index++

            column.index = index

            if (column.isStacked()) {
                this.#updateIndexes(column.stacked, index)
                index += column.stacked.length
            } else {
                index += 1
            }
        }
    }
}
