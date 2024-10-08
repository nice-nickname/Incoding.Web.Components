
class SplitTable {

    /**
     * @type { HTMLTableElement }
     */
    root

    /**
     * @private
     * @type { string }
     */
    id

    /**
     * @private
     * @type { string }
     */
    css

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
     * @type { SplitTableSchema }
     */
    nested


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


    constructor(table) {
        this.id = table.id
        this.css = table.css
        this.row = table.row
        this.columns = table.columns
        this.nestedField = table.nestedField
        this.nested = table.nested

        this.root = document.createElement('table')

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
    }

    render() {
        this.root.classList.add('split-table')

        this.header.render()
        this.footer.render()
    }

    /**
     * @param { HTMLElement } container
     */
    appendTo(container) {
        this.render()

        container.append(this.root)
    }


    /**
     * @type { Column[] }
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
}
