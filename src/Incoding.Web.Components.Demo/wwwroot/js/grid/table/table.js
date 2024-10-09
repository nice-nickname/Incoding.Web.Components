
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
     * @type { Filter }
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
     * @type { ContextMenu }
     */
    contextMenu


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
        this.filter = new Filter(this)
        this.menu = new ColumnMenu(this)
        this.columnEdit = new ColumnEdit(this)
        this.columnResize = new ColumnResize(this)
        this.hover = new Hover(this)
        this.contextMenu = new ContextMenu(this)

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
        this.rowDropdown?.destroy()

        this.sort.destroy()
        this.filter.destroy()
        this.menu.destroy()
        this.columnResize.destroy()
        this.hover.destroy()
        this.contextMenu.destroy()

        this.root.remove()
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

    /**
     * @param { number } rowIndex
     * @param { DataBinding } dataBinding
     */
    renderNested(rowIndex, dataBinding) {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        td.colSpan = this.getFlatColumns().length
        td.classList.add('table-container')

        const nested = new SplitTable(this.nested, this.format, dataBinding)
        nested.appendTo(td)

        tr.append(td)

        const parentTr = this.getRow(rowIndex)
        parentTr.after(tr)

        dataBinding.addTable(nested)
    }

    removeNested(rowIndex) {
        const parentTr = this.getRow(rowIndex)
        const containerTr = parentTr.nextSibling

        if (containerTr.role !== roles.row) {
            containerTr.remove()
        }
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
     * @param { string } uid
     * @returns { Column }
     */
    getColumn(uid) {
        const searchColumn = (columns, uid) => {
            for (const column of columns) {
                if (column.uid === uid) {
                    return column
                }

                if (column.isStacked()) {
                    let stacked = searchColumn(column.stacked, uid)

                    if (stacked) {
                        return stacked
                    }
                }
            }

            return null
        }

        return searchColumn(this.columns, uid)
    }

    /**
     * @param { number } index
     */
    getColumnByIndex(index) {
        const columns = this.getFlatColumns()

        return columns.find(column => column.index === index)
    }

    /**
     * @param { Column } column
     */
    getColumnHeader(column) {
        const thead = this.thead
        const th = thead.querySelector(`[data-uid="${column.uid}"]`)

        return th
    }

    getRow(rowIndex) {
        for (const tr of this.tbody.rows) {
            if (tr.dataset.index == rowIndex) {
                return tr
            }
        }
        return null
    }

    getData() {
        return this.dataBinding.getData()
    }


    #initializeTableTag(table) {
        this.root.role = roles.table

        this.root.id = table.id
        this.root.classList.add('split-table')
        this.root.classList.add(...table.css)
    }
}
