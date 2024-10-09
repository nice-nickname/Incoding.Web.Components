
class DataBinding {

    /**
     * @type { object[] }
     */
    #data

    /**
     * @type { object[] }
     */
    #visibleData


    /**
     * @type { SplitTable[] }
     */
    #tables

    /**
     * @type { boolean }
     */
    #isDataLoading

    /**
     * @type { RenderingBehaviour }
     */
    #renderer

    /**
     * @type { { column: Column, criteria: Set<any> }[] }
     */
    #filters

    /**
     * @type { Column | null }
     */
    #sortedColumn

    /**
     * @type { { [index: number]: DataBinding } }
     */
    #nested

    constructor() {
        this.#tables = []
        this.#filters = []
        this.#nested = { }

        this.#data = []
        this.#visibleData = this.#data

        this.#isDataLoading = false
    }


    setRenderer(renderer) {
        this.#renderer = renderer
    }

    addTable(table) {
        this.#tables.push(table)
    }

    unbind() {
        this.#data = []
        this.#visibleData = this.#data

        for (const table of this.#tables) {
            table.removeRows()

            if (this.#isDataLoading) {
                table.appendPlaceholderRows()
            }
        }

        this.#renderer.reset()
    }

    /**
     * @param { object[] } data
     */
    appendData(data) {
        this.#data.push(...data)

        for (const table of this.#tables) {
            if (this.#isDataLoading) {
                table.setFooterLoading()
            } else {
                table.updateTotals()
            }
        }

        this.#renderer.handleDataChanged()
    }

    /**
     * @param { number } start
     * @param { number } end
     */
    appendChunk(start, end) {
        const chunk = this.#visibleData.slice(start, end)

        for (const table of this.#tables) {
            table.appendRows(chunk)

            if (this.#isDataLoading) {
                table.appendPlaceholderRows()
            }
        }
    }

    schemaUpdated() {
        this.#renderer.reset()

        for (const table of this.#tables) {
            table.header.render()
            table.footer.render()
            table.colGroup.render()

            table.removeRows()
        }

        this.#renderer.handleDataChanged()
    }

    dataUpdated() {
        this.#renderer.reset()

        this.#visibleData = this.#data

        this.#applySort()
        this.#applyFilters()

        for (const table of this.#tables) {
            table.removeRows()
        }

        this.#renderer.handleDataChanged()
    }

    totalsUpdated() {
        for (const table of this.#tables) {
            table.removePlaceholders()
            table.updateTotals()
        }
    }

    setDataLoading(value) {
        this.#isDataLoading = value
    }

    renderNested(rowIndex) {
        const rowData = this.#data[rowIndex]
        const nestedData = rowData[this.#tables[0].nestedField]

        const binding = new DataBinding()
        binding.setRenderer(new ImmediateRenderingBehaviour(binding))

        for (const table of this.#tables) {
            table.renderNested(rowIndex, binding)
        }

        binding.appendData(nestedData)

        this.#nested[rowIndex] = binding
    }

    removeNested(rowIndex) {
        for (const table of this.getTables()) {
            table.removeNested(rowIndex)
        }

        for (const nested of this.#nested[rowIndex].getTables()) {
            nested.destroy()
        }

        delete this.#nested[rowIndex]
    }

    isDataLoading() {
        return this.#isDataLoading
    }

    getOriginData() {
        return this.#data
    }

    getData() {
        return this.#visibleData
    }

    getTables() {
        return this.#tables
    }


    setSort(column) {
        this.#sortedColumn = column
    }

    /**
     * @param { Column } column
     * @param { Set<any> } criteria
     */
    addFilter(column, criteria) {
        const existingFilter = this.#filters.find(filter => filter.column.uid === column.uid)

        if (existingFilter) {
            existingFilter.criteria = criteria
        } else {
            this.#filters.push({ column, criteria })
        }
    }

    removeFilter(column) {
        this.#filters.splice(
            this.#filters.findIndex(s => s.column == column), 1)
    }

    getFilters() {
        return this.#filters
    }

    /**
     * @param { object[] } data
     */
    #applyFilters() {
        if (this.#filters.length === 0) {
            return
        }

        this.#visibleData = this.#data.filter(item => {
            let isVisible = true

            for (const { column, criteria } of this.#filters) {
                const value = column.getValue(item)
                isVisible = criteria.has(value)

                if (!isVisible) break
            }

            return isVisible
        })
    }


    #applySort() {
        if (this.#sortedColumn == null) {
            return
        }

        const sortData = (data, cmp, sortedBy) => {
            if (!data || data.length === 0)
                return

            data.sort((a, b) => {
                const left = column.getValue(a)
                const right = column.getValue(b)

                if (left == null) return sortedBy === ColumnSortOption.Asc ? -1 : 1
                if (right == null) return sortedBy === ColumnSortOption.Asc ? 1 : -1
                if (left == right) return 0

                return sortedBy === ColumnSortOption.Asc ?
                    cmp(left, right) :
                    -cmp(left, right)
            })
        }

        const data = this.#visibleData
        const column = this.#sortedColumn
        const sortFn = column.getSortComparator()

        sortData(data, sortFn, column.sortedBy)

        if (this.getTables()[0].isSimpleMode()) {
            const nestedField = this.getTables()[0].nestedField
            data.forEach(item => {
                sortData(item[nestedField], sortFn, column.sortedBy)
            })
        }
    }
}
