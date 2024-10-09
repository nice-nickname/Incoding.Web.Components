
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
     * @type { RowRenderer }
     */
    rowRenderer


    /**
     * @param { TableSchema } table
     */
    constructor(table, format) {
        this.id = table.id
        this.row = table.row
        this.columns = table.columns
        this.nestedField = table.nestedField
        this.nested = table.nested

        this.format = format

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

        this.rowRenderer = new RowRenderer(this)
    }

    render() {
        this.header.render()
        this.footer.render()
    }

    renderRows(data) {
        this.rowRenderer.render(data)
    }

    /**
     * @param { HTMLElement } container
     */
    appendTo(container) {
        this.render()

        container.append(this.root)
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

    #initializeTableTag(table) {
        this.root.setAttribute('role', 'table')

        this.root.id = table.id
        this.root.classList.add('split-table')
        this.root.classList.add(...table.css)
    }
}
