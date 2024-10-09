
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

        for (const column of columns) {
            const td = document.createElement('td')

            tr.append(td)
        }

        tfoot.append(tr)
    }
}
