
class SortController {

    /**
     * @type { TableController }
     */
    table

    /**
     * @type { Column }
     */
    sortedColumn

    constructor(table, sortedColumn = null) {
        this.table = table
        this.sortedColumn = sortedColumn

        if (this.sortedColumn) {
            this.#updateSortAttribute()
        }
    }

    /**
     *
     * @param { Column } column
     */
    sortColumn(column) {
        this.sortedColumn = column
        this.#toggleSort()
        this.#updateSortAttribute()

        const getter = this.table.getFieldAccessorByColumn(column)

        this.#sortData(this.table.data, getter, this.table.structure)

        this.table.parent.siblings.forEach(table => {
            table.removeAllRows()

            if (!table.splitGrid) {
                table.renderRows()
            }
        })

        if (this.table.splitGrid) {
            this.table.splitGrid.rerender()
        }
    }

    enable() {
        const $sortButtons = this.table.$header.find('[role=sort]')

        $sortButtons.removeAttr('disabled')
    }

    disable() {
        const $sortButtons = this.table.$header.find('[role=sort]')

        $sortButtons.attr('disabled', 'true')
    }

    reset() {
        const $sorter = this.table.$header.find('[role=sort].active')
        $sorter.removeClass('active')
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

    #toggleSort() {
        const value = this.sortedColumn.sortedBy

        this.sortedColumn.sortedBy = value === 'Asc' ? 'Desc' : 'Asc'
    }

    #updateSortAttribute() {
        const $sorter = this.table.$header.find(`[data-index=${this.sortedColumn.index}] [role=sort]`)

        $sorter.addClass('active')
            .attr('data-sort', this.sortedColumn.sortedBy)
    }
}
