
class Sort {

    /**
     * @type { SplitTable }
     */
    splitTable


    /**
     * @type { ColumnModel | null }
     */
    sortedColumn = null


    constructor(splitTable) {
        this.splitTable = splitTable;

        this.splitTable.addManagedEventListener("header", "click", this.#handleHeaderClick)
    }

    isSorted() {
        return this.sortedColumn !== null
    }

    /**
     * @param { ColumnModel } column
     * @param { SortOrder } order
     */
    sortColumn(column, order) {
        if (this.isSorted()) {
            this.#setSortIcon(this.sortedColumn, false)
        }

        this.sortedColumn = column
        this.sortedColumn.sortedBy = order
        this.#setSortIcon(this.sortedColumn, true)

        this.#sortData()
        this.splitTable.refreshRows()
    }

    destroy() { }

    #setSortIcon(column, isSorted) {
        const th = this.splitTable.getHeaderCell(column.uid)

        th.classList.remove(classes.sorted, classes.sortedAsc, classes.sortedDesc)

        if (isSorted) {
            const sortClass = column.sortedBy === SortOrder.Asc
                ? classes.sortedDesc
                : classes.sortedAsc

            th.classList.add(classes.sorted, sortClass)
        }
    }


    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     */
    #handleHeaderClick = (ev, panelModel) => {
        const { target } = ev

        if (target.role === roles.sort || target.tagName === 'TH') {
            const th = target.closest('th')
            const column = panelModel.getColumn(th.dataset.uid)

            this.#invokeSort(column)
        }
    }

    /**
     * @param { ColumnModel } column
     */
    #invokeSort(column) {
        let direction = column.sortedBy

        if (direction) {
            direction = direction === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc
        } else {
            direction = SortOrder.Asc
        }

        this.sortColumn(column, direction)
    }

    #sortData() {
        const data = this.splitTable.dataSource.getData()

        const order = this.sortedColumn.sortedBy
        const cmp = this.sortedColumn.getAscSortComparator()

        const sortedData = data.sort((left, right) => {
            const l = this.sortedColumn.getValue(left)
            const r = this.sortedColumn.getValue(right)

            if (l == null) return order === SortOrder.Asc ? -1 : 1;
            if (r == null) return order === SortOrder.Desc ? 1 : -1;
            if (l === r) return 0;

            return order === SortOrder.Asc
                ? cmp(l, r)
                : -cmp(l, r)
        })

        this.splitTable.dataSource.setData(sortedData)
    }
}
