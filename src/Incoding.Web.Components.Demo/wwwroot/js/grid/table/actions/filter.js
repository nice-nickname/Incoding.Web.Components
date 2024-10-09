
class FilterModule {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table
    }

    destroy() {

    }

    /**
     * @param { Column } column
     */
    filterColumn(column) {

    }

    /**
     * @param { Column } column
     */
    clearFilter(column) {
        
    }

    /**
     * @param { Column } column
     */
    createMenu(column) {
        const data = this.table.getData()
        const filterData = this.#getFilterData(column, data)

        const th = this.table.getColumnHeader(column.index)
        const coords = th.getBoundingClientRect()

        const filter = new FilterMenu(column, filterData)
        filter.render(coords.bottom, coords.left)
    }

    /**
     * @param { object[] } data
     * @param { Column } column
     * @returns { FilterItem[] }
     */
    #getFilterData(column, data) {
        return [...this.#getFilterValues(column, data)].map(value => {
            let text = value
            if (text == 'null' || text == 'undefiend') {
                text = '(Blank)'
            }

            return { value: value, text: text, selected: true }
        })
    }

    /**
     * @param { object[] } data
     * @param { Column } column
     * @returns { Set<string> }
     */
    #getFilterValues(column, data) {
        const values = new Set()

        for (const rowData of data) {
            let val = column.getValue(rowData)

            if (val == null && column.type === ColumnType.Numeric) {
                val = 0
            }

            values.add(String(val))
        }

        return values
    }
}
