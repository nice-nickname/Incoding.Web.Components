
class ColumnResize {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()
    }

    autoFitTable() {
        const columns = this.table.getFlatColumns()
            .filter(column => !column.isSpecialColumn())

        for (const column of columns) {
            this.autoFit(column)
        }
    }

    /**
     * @param { Column } column
     */
    autoFit(column) {
        const tableEl = this.table.root

        const contentCells = tableEl.querySelectorAll(`tbody td[data-uid="${column.uid}"]`)
        const headerCells = tableEl.querySelectorAll(`thead th[data-uid="${column.uid}"]`)

        const contentWidth = this.#createAutoFitTable(contentCells, 'tbody')
        const headerWidth = this.#createAutoFitTable(headerCells, 'thead')

        this.resize(column.uid, Math.max(contentWidth, headerWidth))
        this.table.columnChanged(column)
    }

    /**
     * @param { string } uid
     * @param { number } width
     */
    resize(uid, width) {
        const column = this.table.getColumn(uid)
        this.table.schema.resizeColumn(uid, width)

        this.table.colGroup.updateColumn(column)

        if (this.table.isSimpleMode()) {
            for (const table of this.table.root.querySelectorAll('table')) {
                const splitTable = $(table).data('table')
                const nestedColumn = splitTable.getColumn(uid)
                splitTable.colGroup.updateColumn(nestedColumn)
            }
        }
    }

    #addEventListeners() {
        this.table.thead.addEventListener('mousedown', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.thead.removeEventListener('mousedown', this.#handleClick)
    }

    /**
     * @param { NodeListOf<HTMLElement> } contentCells
     * @param { 'tbody' | 'thead' } bodyTag
     * @returns { number }
     */
    #createAutoFitTable(contentCells, bodyTag) {
        const table = this.table.root;

        const autoFitTable = table.cloneNode(false)
        autoFitTable.style.cssText = 'table-layout: auto;width: auto;'

        const autoFitBody = document.createElement(bodyTag)
        autoFitTable.appendChild(autoFitBody)

        for (const cell of contentCells) {
            const row = document.createElement('tr')
            row.appendChild(cell.cloneNode(true))

            autoFitBody.append(row)
        }

        document.body.appendChild(autoFitTable)
        const width = autoFitTable.getBoundingClientRect().width
        document.body.removeChild(autoFitTable)

        return Math.ceil(width)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const { target } = ev

        if (target.role !== roles.resize) {
            return
        }

        ev.preventDefault()

        const th = target.closest('th')
        const column = this.table.getColumn(th.dataset.uid)

        const handler = new ColumnResizeHandler(this.table, column, th)
        handler.start()
    }
}
