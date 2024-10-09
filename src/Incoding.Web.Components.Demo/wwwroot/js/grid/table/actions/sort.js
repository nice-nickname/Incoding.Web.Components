
class SortModule {

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

        const tables = this.table.dataBinding.getTables()
        for (const table of tables) {
            table.sort.#removeSortIcons()
        }

        const data = this.table.dataBinding.getData()
        const comparatorFn = column.getSortComparator()

        data.sort((a, b) => {
            const left = column.getValue(a)
            const right = column.getValue(b)

            if (left == null) return direction === ColumnSortOption.Asc ? -1 : 1
            if (right == null) return direction === ColumnSortOption.Asc ? 1 : -1
            if (left == right) return 0

            return direction === ColumnSortOption.Asc ?
                comparatorFn(left, right) :
                -comparatorFn(left, right)
        })

        this.#setSortIcon(column)
        this.table.dataBinding.dataUpdated()
    }

    /**
     * @param { Column } column
     */
    #setSortIcon(column) {
        const th = this.table.getColumnHeader(column.index)

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
        if (ev.target.role !== 'sort' && ev.target.tagName !== 'TH') {
            return
        }

        const th = $(ev.target).closest('th')[0]
        const column = this.table.getColumn(th.dataset.index)

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
