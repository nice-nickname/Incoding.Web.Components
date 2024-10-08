
class TableHeaderRenderer {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { number }
     */
    maxRowSpan

    /**
     * @type { boolean }
     */
    hasStacked

    constructor(table) {
        this.table = table

        const columns = this.table.columns

        this.hasStacked = columns.some(c => c.stacked.length !== 0)
        this.maxRowSpan = this.hasStacked ? 2 : 1
    }

    render() {
        const thead = this.table.thead
        const trs = []
        const columns = this.table.columns

        trs.push(this.renderRow(columns))

        if (this.hasStacked) {
            const stacked = columns.filter(s => s.stacked.length)
                                   .flatMap(s => s.stacked)

            trs.push(this.renderRow(stacked))
        }

        thead.append(...trs)
    }

    /**
     * @private
     * @param { Column[] } columns
     */
    renderRow(columns) {
        const tr = document.createElement('tr')

        for (const column of columns) {
            const isStacked = column.stacked.length !== 0

            const colspan = isStacked ? column.stacked.length : 1
            const rowspan = isStacked ? 1 : this.maxRowSpan

            const th = this.createCell(column, colspan, rowspan)

            tr.appendChild(th)
        }

        return tr
    }

    /**
     * @private
     * @param { Column } column
     */
    createCell(column, colSpan, rowSpan) {
        const th = document.createElement('th')
        th.colSpan = colSpan
        th.rowSpan = rowSpan

        if (column.sortable) {
            th.classList.add('sortable')
        }

        if (column.filterable) {
            th.classList.add('filterable')
        }

        if (column.resizable) {
            th.classList.add('resizable')
        }

        th.innerHTML = column.title

        return th
    }
}
