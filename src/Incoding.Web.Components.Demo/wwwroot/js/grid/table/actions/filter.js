
class Filter {

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
    filterColumn(column, criteria) {
        const dataBinding = this.table.dataBinding

        this.table.colGroup.setFilterColumn(column)

        dataBinding.addFilter(column, criteria)
        dataBinding.dataUpdated()
    }

    /**
     * @param { Column } column
     */
    clearFilter(column) {
        const dataBinding = this.table.dataBinding

        this.table.colGroup.removeFilterColumn(column)

        dataBinding.removeFilter(column)
        dataBinding.dataUpdated()
    }

    /**
     * @param { Column } column
     */
    createMenu(column) {
        const th = this.table.getColumnHeader(column)
        const { bottom, left } = th.getBoundingClientRect()
        const filterData = this.#getFilterData(column)

        new FilterMenu(this, column, filterData).render(bottom, left)
    }

    /**
     * @param { Column } column
     * @returns { FilterItem[] }
     */
    #getFilterData(column) {
        const currentFilter = this.#getCurrentFilter(column)
        const filterValues = this.#getFilterValues(column)

        return [...filterValues]
            .map(value => ({
                value,
                text: this.#formatFilterValue(column, value),
                selected: !currentFilter || currentFilter.criteria.has(value),
                visible: true
            }))
    }

    /**
     * @param { Column } column
     * @param { any } value
     */
    #formatFilterValue(column, value) {
        if (column.type !== ColumnType.Numeric && ExecutableHelper.IsNullOrEmpty(value)) {
            return '(Blank)';
        }
        return column.formatToString(value);
    }

    /**
     * @param { Column } column
     * @returns { Set<string> }
     */
    #getFilterValues(column) {
        const data = this.table.dataBinding.getOriginData()
        const prevFilters = this.#getPreviousFilters(column)

        const result = new Set()
        for (const rowData of data) {
            const isVisible = prevFilters.length === 0 ||
                prevFilters.every(({ column: filterColumn, criteria }) =>
                    criteria.has(filterColumn.getValue(rowData)))

            if (isVisible) {
                result.add(column.getValue(rowData))
            }
        }

        return result
    }

    /**
     * @param { Column } column
     */
    #getPreviousFilters(column) {
        const filters = this.table.dataBinding.getFilters()
        const result = []

        for (const filter of filters) {
            if (filter.column.uid === column.uid) break
            result.push(filter)
        }

        return result
    }

    /**
     * @param { Column } column
     */
    #getCurrentFilter(column) {
        const filters = this.table.dataBinding.getFilters()

        return filters.find(filter => filter.column.uid === column.uid)
    }
}
