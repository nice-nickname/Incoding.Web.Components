
class Filter {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { { column: ColumnModel, criteria: any }[] }
     */
    #filters = []

    constructor(splitTable) {
        this.splitTable = splitTable
    }

    filterColumn(column, criteria) {
        column.isFiltered = true

        let filter = this.#filters.find(filter => filter.column === column)

        if (!filter) {
            filter = { column: column }
            this.#filters.push(filter)
        }

        filter.criteria = criteria

        this.#updateDataSource()
        this.splitTable.refreshRows()
    }

    clearFilter(column) {
        this.#filters.removeBy(filter => filter.column === column)

        this.#updateDataSource()
        this.splitTable.refreshRows()
    }

    clearFilters() {
        this.#filters = []

        this.#updateDataSource()
        this.splitTable.refreshRows()
    }

    showFilterMenu(column, top, left) {
        new FilterMenu(this.splitTable, column, this.getFilterData(column))
            .render(top, left)
    }

    destroy() {

    }

    #updateDataSource() {
        const data = this.splitTable.dataSource.getInitialData()

        const filtered = data.filter(rowData => {
            let isVisible = true

            for (const filter of this.#filters) {
                const { column, criteria } = filter

                isVisible = criteria.has(column.getValue(rowData))

                if (!isVisible) break
            }

            return isVisible
        })

        this.splitTable.dataSource.setData(filtered)
    }

    /**
     * @param { ColumnModel } column
     */
    getFilterData(column) {
        const values = this.#getFilterValues(column)
        const currentFilter = this.getFilterByColumn(column)

        const formatValue = (value) => {
            if (column.type === ColumnType.Boolean) {
                return value ? 'True' : 'False'
            }

            if (column.type === ColumnType.Numeric && ExecutableHelper.IsNullOrEmpty(value)) {
                return '(Blank)'
            }

            return column.formatToString(value)
        }

        const isSelected = (value) => {
            return !currentFilter || currentFilter.criteria.has(value)
        }

        return [...values]
            .map(value => ({
                value,
                text: formatValue(value),
                selected: isSelected(value)
            }))
    }

    #getFilterValues(column) {
        const data = this.splitTable.dataSource.getInitialData()

        const precedingFilters = this.getPrecedingFilters(column)

        const isHidden = (rowData) => {
            if (precedingFilters.length === 0) {
                return false
            }

            return !precedingFilters.every(filter => {
                const { column, criteria } = filter

                return criteria.has(column.getValue(rowData))
            })
        }

        const result = new Set()
        for (const rowData of data) {
            if (!isHidden(rowData)) {
                result.add(column.getValue(rowData))
            }
        }

        return result
    }

    getPrecedingFilters(column) {
        const currentFilter = this.#filters.findIndex(filter => filter.column === column)

        return currentFilter >= 0
            ? this.#filters.slice(0, currentFilter)
            : this.#filters
    }

    getFilterByColumn(column) {
        return this.#filters.find(filter => filter.column === column)
    }

}
