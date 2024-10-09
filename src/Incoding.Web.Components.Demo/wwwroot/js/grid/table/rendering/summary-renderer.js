
class SummaryRenderer {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { HTMLTableRowElement }
     */
    #tr

    constructor(table) {
        this.table = table
    }

    render() {
        this.#tr = document.createElement('tr')

        this.update()

        this.table.tbody.append(this.#tr)
    }

    destroy() {
        this.#tr.remove()
    }

    update() {
        if (this.table.summary) {
            this.#renderSummary()
        } else {
            this.#renderSummaryColumns()
        }
    }

    setLoading() {
        const tds = this.#tr.querySelectorAll('td > span')

        for (const td of tds) {
            td.classList.add('table-placeholder')
        }
    }

    #renderSummary() {
        const summary = this.table.summary
        const columns = this.table.getFlatColumns()

        const td = document.createElement('td')
        td.colSpan = columns.length
        td.innerHTML = `<span>${summary.title}</span>`

        this.#tr.replaceChildren(td)
    }

    #renderSummaryColumns() {
        const data = this.table.getData()
        const columns = this.table.getFlatColumns()

        const tds = []
        for (const column of columns) {
            const td = document.createElement('td')
            td.style.textAlign = column.alignment.toString().toLowerCase()
            const span = document.createElement('span')

            const value = column.summaryExpr ? AggregateUtil.executeFormula(data, column.summaryExpr) : 0

            column.formatElement(value, span)

            td.append(span)
            tds.push(td)
        }

        this.#tr.replaceChildren(...tds)
    }
}
