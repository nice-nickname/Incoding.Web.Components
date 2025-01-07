
class SummaryRenderer {

    /**
     * @type { SplitTable }
     */
    parent

    /**
     * @type { HTMLElement[] }
     */
    #trs = []

    constructor(parent) {
        this.parent = parent

        this.#trs = this.parent.headerRenderer.tables.map(table => {
            const tbody = document.createElement('tbody')
            const tr = document.createElement('tr')
            tr.classList.add(classes.summaryRow)

            tbody.append(tr)
            table.append(tbody)

            return tr
        })
    }

    render() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            this.refreshPanel(i)
        }
    }

    destroy() {
        this.#trs.forEach(tr => {
            tr.remove()
        })
    }

    setLoading() {
        for (const tr of this.#trs) {
            tr.querySelectorAll('span')
                .forEach(span => {
                    span.classList.add(classes.loadingPlaceholder)
                })
        }
    }

    refreshPanel(index) {
        const panel = this.parent.schemaModel[index]
        const columns = panel.getFlatColumns()

        const tr = this.#trs[index]

        let tds = []

        if (columns.some(column => column.summaryExpr)) {
            tds = this.#createSummaryCells(panel)
        } else {
            tds = [this.#createEmptyCells(panel)]
        }

        tr.replaceChildren(...tds)
    }

    /**
     * @param { TablePanelModel } panelModel
     */
    #createEmptyCells(panelModel) {
        const td = document.createElement('td')
        td.classList.add(classes.summaryCell)
        td.colSpan = panelModel.getFlatColumns().length

        td.innerHTML = panelModel.summary
            ? panelModel.summary.title
            : '&nbsp;'

        return td
    }

    /**
     * @param { TablePanelModel } panelModel
     */
    #createSummaryCells(panelModel) {
        const data = this.parent.dataSource.getData()
        const columns = panelModel.getFlatColumns()

        return columns.map(column => {
            return this.#createCell(column, data)
        })
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    #createCell(column, data) {
        const td = document.createElement('td')
        td.classList.add(classes.summaryCell)
        td.style.textAlign = column.alignment

        let value = column.summaryExpr ? AggregateUtil.executeFormula(data, column.summaryExpr) : 0
        if (!value || isNaN(value)) {
            value = 0
        }
        td.style.setProperty('--value', value + '%')

        const span = document.createElement('span')
        span.innerText = `${value.toFixed(0)}%`

        td.append(span)
        return td
    }
}
