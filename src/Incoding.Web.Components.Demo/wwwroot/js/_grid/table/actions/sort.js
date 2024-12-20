
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

        this.splitTable.addManagedEventListener("header", "click", this.#handleClick)
    }

    isSorted() {
        return this.sortedColumn !== null
    }

    /**
     * @param { ColumnModel } column
     * @param { ColumnSortOrder } order
     */
    sortColumn(column, order) {
        if (this.isSorted()) {
            this.#setSortIcon(this.sortedColumn, false)
        }

        this.sortedColumn = column
        this.sortedColumn.sortedBy = order
        this.#setSortIcon(this.sortedColumn, true)

        this.#sortData()
        this.splitTable.refresh()
    }

    destroy() { }

    #setSortIcon(column, isSorted) {
        const th = this.splitTable.getColumnHeader(column.uid)

        th.classList.remove(classes.sorted, classes.sortedAsc, classes.sortedDesc)

        if (isSorted) {
            const sortOrderClass = column.sortedBy === ColumnSortOrder.Asc
                ? classes.sortedDesc
                : classes.sortedAsc

            th.classList.add(classes.sorted, sortOrderClass)
        }
    }


    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     */
    #handleClick = (ev, panelModel) => {
        const { target } = ev

        if (target.role !== roles.sort && target.tagName !== 'TH') {
            return
        }

        const th = target.closest('th')
        const column = panelModel.getColumn(th.dataset.uid)

        this.#invokeSort(column)
    }

    /**
     * @param { ColumnModel } column
     */
    #invokeSort(column) {
        let direction = column.sortedBy

        if (direction) {
            direction = direction === ColumnSortOrder.Asc ? ColumnSortOrder.Desc : ColumnSortOrder.Asc
        } else {
            direction = ColumnSortOrder.Asc
        }

        this.sortColumn(column, direction)
    }

    #sortData() {
        const data = this.splitTable.dataSource.getData()

        const order = this.sortedColumn.sortedBy
        const cmp = this.sortedColumn.getAscSortComparator()

        let newData = data.sort((a, b) => {
            const l = this.sortedColumn.getValue(a)
            const r = this.sortedColumn.getValue(b)

            if (l == null) return order === ColumnSortOrder.Asc ? -1 : 1;
            if (r == null) return order === ColumnSortOrder.Desc ? 1 : -1;
            if (l === r) return 0;

            return order === ColumnSortOrder.Asc
                ? cmp(l, r)
                : -cmp(l, r)
        })

        this.splitTable.dataSource.setData(newData)
    }
}
