
class Sort {

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

    /**
     * @param { Column } column
     * @param { ColumnSortOption } direction
     */
    sortColumn(column, direction) {
        column.sortedBy = direction

        const dataBinding = this.table.dataBinding

        const tables = dataBinding.getTables()
        for (const table of tables) {
            table.sort.#removeSortIcons()
        }

        this.#setSortIcon(column)

        dataBinding.setSort(column)
        dataBinding.dataUpdated()
    }

    /**
     * @param { Column } column
     */
    #setSortIcon(column) {
        const th = this.table.getColumnHeader(column)

        th.classList.remove('sorted-asc', 'sorted-desc')
        th.classList.add('sorted', `sorted-${column.sortedBy.toString().toLowerCase()}`)
    }

    #removeSortIcons() {
        const thead = this.table.thead

        if (thead.querySelector('.sorted')) {
            thead.querySelector('.sorted').classList.remove('sorted', 'sorted-asc', 'sorted-desc')
        }
    }

    #addEventListeners() {
        this.table.thead.addEventListener('click', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.thead.addEventListener('click', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const { target } = ev

        if (target.role !== roles.sort && target.tagName !== 'TH') {
            return
        }

        const th = target.closest('th')
        const column = this.table.getColumn(th.dataset.uid)

        if (column.sortable) {
            this.#invokeSort(column)
        }
    }

    /**
     * @param { Column } column
     */
    #invokeSort(column) {
        let direction = column.sortedBy

        if (direction === null) {
            direction = ColumnSortOption.Asc
        } else {
            direction = direction === ColumnSortOption.Asc ?
                ColumnSortOption.Desc :
                ColumnSortOption.Asc
        }

        this.sortColumn(column, direction)
    }
}
