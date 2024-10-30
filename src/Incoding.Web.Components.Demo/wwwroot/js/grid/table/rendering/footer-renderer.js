
class TableFooterRenderer {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table
    }

    render() {
        const tfoot = this.table.tfoot
        const columns = this.table.getFlatColumns()

        const tr = document.createElement('tr')

        const tds = []

        for (const column of columns) {
            const td = document.createElement('td')
            td.innerHTML = '&nbsp;'

            if (column.isPinned) {
                td.classList.add('pinned')
            }

            tds.push(td)
        }

        const pinnedColumnsLength = columns.filter(s => s.isPinned).length

        if (pinnedColumnsLength !== 0) {
            let pinOffset = 0
            for (let i = 0; i < pinnedColumnsLength; i++) {
                const column = columns[i];
                const td = tds[i]

                td.style.left = pinOffset + 'px'
                pinOffset += column.width

                if (i === pinnedColumnsLength - 1) {
                    td.classList.add('pinned-last')
                }
            }
        }

        tr.append(...tds)
        tfoot.replaceChildren(tr)
        this.updateTotals()
    }

    updateTotals() {
        const tds = this.table.tfoot.querySelectorAll('td')
        const columns = this.table.getFlatColumns()

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            if (!column.totalable) {
                continue
            }

            const td = tds.item(i)
            const span = document.createElement('span')

            const totalValue = this.#calculateTotal(column)
            column.formatElement(totalValue, span)

            td.replaceChildren(span)
        }
    }

    setLoading() {
        const cells = this.table.tfoot.querySelectorAll('span')

        for (const cell of cells) {
            cell.classList.add('table-placeholder')
        }
    }

    /**
     * @param { Column } column
     */
    #calculateTotal(column) {
        const data = this.table.getData()
        const field = column.spreadField ? `${column.spreadField}.${column.spreadIndex}.${column.field}` : column.field

        return DataUtil.aggregate(data, field, 'sum')
    }
}
