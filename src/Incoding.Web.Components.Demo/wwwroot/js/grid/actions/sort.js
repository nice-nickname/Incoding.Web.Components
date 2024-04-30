
class SortController {

    /**
     * @type { TableController }
     */
    table

    /**
     * @type { Column }
     */
    sortedColumn

    /**
     * @type { {
     *  sortedBy: 'Asc' | 'Desc'
     *  index: number
     * } | null }
     */
    defaultSort

    constructor(table, sortedColumn = null) {
        this.table = table

        if (sortedColumn) {
            this.defaultSort = {
                index: sortedColumn.index,
                sortedBy: sortedColumn.sortedBy
            }

            this.setDefaultSort()
        }
    }

    enable() {
        this.table.$header.find('[role=sort]').removeClass('disabled')
    }

    disable() {
        this.table.$header.find('[role=sort]').addClass('disabled')
    }

    reset() {
        if (this.sortedColumn) {
            this.#setActiveSortButton(false)
        }

        this.sortedColumn = null
    }

    /**
     *
     * @param { Column } column
     */
    sortColumn(column) {
        this.#setSortedColumn(column)

        this.sortedColumn.sortedBy = this.sortedColumn.sortedBy === 'Asc' ? 'Desc' : 'Asc'

        const getter = this.table.getFieldAccessorByColumn(column)

        this.#sortData(this.table.data, getter, this.table.structure)

        this.table.rerender()
    }

    setDefaultSort() {
        if (!this.defaultSort) return

        const sorted = this.table.structure.columns.find(s => s.index === this.defaultSort.index)
        sorted.sortedBy = this.defaultSort.sortedBy

        this.#setSortedColumn(sorted)
    }

    #setSortedColumn(column) {
        this.table.parent.siblings.forEach(table => {
            table.sortController.reset()
        })

        this.sortedColumn = column

        this.#setActiveSortButton(true)
    }

    #setActiveSortButton(active) {
        const $activeSort = this.table.$header.find(`[data-index=${this.sortedColumn.index}] [role=sort]`)

        if (active) {
            $activeSort.addClass('active').attr('data-sort', this.sortedColumn.index)
        } else {
            $activeSort.removeClass('active').removeAttr('data-sort')
        }
    }

    #sortData(data, getter, structure) {
        if (!data || data.length === 0)
            return

        data.sort((a, b) => {
            const left = getter(a)
            const right = getter(b)

            if (!left) return -1
            if (!right) return 1

            return getter(a) >= getter(b) ? 1 : -1
        })

        if (this.sortedColumn.sortedBy === 'Desc') {
            data.reverse()
        }

        if (this.table.isSimpleMode() && structure.nested) {
            data.forEach(item => {
                const nested = item[structure.nestedField]

                this.#sortData(nested, getter, structure.nested)
            })
        }
    }
}
