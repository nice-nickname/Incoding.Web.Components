
class SplitTable {

    /**
     * @type { string }
     */
    id


    /**
     * @type { HTMLTableElement }
     */
    root

    /**
     * @type { Row }
     */
    row

    /**
     * @type { Column[] }
     */
    columns

    /**
     * @type { string }
     */
    nestedField

    /**
     * @type { TableSchema }
     */
    nested

    /**
     * @type { TableSchema }
     */
    schema


    /**
     * @type { FormatOptions }
     */
    format


    /**
     * @type { HTMLTableSectionElement }
     */
    colgroup

    /**
     * @type { HTMLTableSectionElement }
     */
    thead

    /**
     * @type { HTMLTableSectionElement }
     */
    tbody

    /**
     * @type { HTMLTableSectionElement }
     */
    tfoot


    /**
     * @type { TableHeaderRenderer }
     */
    header

    /**
     * @type { TableFooterRenderer }
     */
    footer

    /**
     * @type { ColgroupRenderer }
     */
    colGroup

    /**
     * @type { RowRenderer }
     */
    rowRenderer


    /**
     * @type { RowDropdown }
     */
    rowDropdown


    /**
     * @type { object[] }
     */
    data


    /**
     * @type { DataBinding }
     */
    dataBinding


    /**
     * @type { SortModule }
     */
    sort

    /**
     * @type { FilterModule }
     */
    filter

    /**
     * @type { ColumnMenu }
     */
    menu

    /**
     * @type { ColumnEdit }
     */
    columnEdit

    /**
     * @type { ColumnResize }
     */
    columnResize

    /**
     * @type { Hover }
     */
    hover


    /**
     * @param { TableSchema } table
     */
    constructor(table, format, binding) {
        this.id = table.id
        this.row = table.row
        this.columns = table.columns
        this.nestedField = table.nestedField
        this.nested = table.nested
        this.data = []

        this.format = format

        this.dataBinding = binding

        this.root = document.createElement('table')
        this.#initializeTableTag(table)


        this.thead = document.createElement('thead')
        this.tbody = document.createElement('tbody')
        this.tfoot = document.createElement('tfoot')
        this.colgroup = document.createElement('colgroup')

        this.root.append(
            this.colgroup,
            this.thead,
            this.tbody,
            this.tfoot
        )

        this.header = new TableHeaderRenderer(this)
        this.footer = new TableFooterRenderer(this)
        this.colGroup = new ColgroupRenderer(this)

        this.rowRenderer = new RowRenderer(this)

        if (this.row.dropdownTmpl) {
            this.rowDropdown = new RowDropdown(this)
        }

        this.sort = new SortModule(this)
        this.filter = new FilterModule(this)
        this.menu = new ColumnMenu(this)
        this.columnEdit = new ColumnEdit(this)
        this.columnResize = new ColumnResize(this)
        this.hover = new Hover(this)

        this.colGroup.render()
        this.header.render()
        this.footer.render()
    }

    /**
     * @param { HTMLElement } container
     */
    appendTo(container) {
        container.append(this.root)
    }

    destroy() {
        this.header.destroy()
        this.colGroup.destroy()
        this.rowDropdown.destroy()

        this.sort.destroy()
        this.filter.destroy()
        this.menu.destroy()
        this.columnResize.destroy()
        this.hover.destroy()
    }

    /**
     * @param { object[] } data
     */
    appendRows(data) {
        this.rowRenderer.render(data)
    }

    appendPlaceholderRows() {
        this.rowRenderer.renderPlaceholders()
    }

    removeRows() {
        this.tbody.innerHTML = ''
        this.rowRenderer.restart()
    }

    removePlaceholders() {
        this.rowRenderer.removePlaceholders()
    }

    updateTotals() {
        this.footer.updateTotals()
    }

    setFooterLoading() {
        this.footer.setLoading()
    }

    /**
     * @returns { Column[] }
     */
    getFlatColumns() {
        const columns = []

        for (const column of this.columns) {
            if (column.stacked.length) {
                columns.push(...column.stacked)
            } else {
                columns.push(column)
            }
        }

        return columns
    }

    /**
     * @param { number | string } index
     */
    getColumn(index) {
        for (const column of this.columns) {

            if (column.index == index) {
                return column
            }

            if (column.stacked) {
                const stacked = column.stacked.find(c => c.index == index)

                if (stacked) {
                    return stacked
                }
            }
        }

        return null
    }

    /**
     * @param { number | string } index
     */
    getColumnHeader(index) {
        const thead = this.thead
        const th = thead.querySelector(`[data-index="${index}"]`)

        return th
    }

    getRow(rowIndex) {
        return this.tbody.rows.item(rowIndex)
    }

    getData() {
        return this.dataBinding.getData()
    }


    #initializeTableTag(table) {
        this.root.setAttribute('role', 'table')

        this.root.id = table.id
        this.root.classList.add('split-table')
        this.root.classList.add(...table.css)
    }
}
