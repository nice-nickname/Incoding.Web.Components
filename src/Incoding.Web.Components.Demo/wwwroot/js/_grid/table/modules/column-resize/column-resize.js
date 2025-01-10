
class ColumnResize {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable

        this.splitTable.addManagedEventListener("header", "mousedown", this.#handleHeaderClick)
    }

    destroy() { }

    resize(panelIndex, column, width) {
        const panel = this.splitTable.schemaModel[panelIndex]
        panel.edit(editor => {
            editor.resize(column.uid, width)
        })

        this.splitTable.colgroupsRenderer.updateColumn(panelIndex, column)
    }

    /**
     * @param { number } panelIndex
     */
    autoFitAll(panelIndex) {
        const panelModel = this.splitTable.schemaModel[panelIndex]
        const columns = panelModel.getFlatColumns().filter(col => col.resizable)

        for (const column of columns) {
            this.autoFit(panelIndex, column)
        }
    }

    /**
     * @param { number } panelIndex
     * @param { ColumnModel } column
     */
    autoFit(panelIndex, column) {
        const panelModel = this.splitTable.schemaModel[panelIndex]

        const headerTable = this.splitTable.getHeaderTable(panelIndex)
        const contentTable = this.splitTable.getContentTable(panelIndex)

        const headerCells = headerTable.querySelectorAll(`th[data-uid="${column.uid}"]`)
        const contentCells = contentTable.querySelectorAll(`tbody td[data-uid="${column.uid}"]`)
        const footerCells = contentTable.querySelectorAll(`tfoot td[data-uid="${column.uid}"]`)

        const headerWidth = this.#calculateAutoFitTable(headerTable, headerCells, "thead")
        const contentWidth = this.#calculateAutoFitTable(contentTable, contentCells, "tbody")
        const footerWidth = this.#calculateAutoFitTable(contentTable, footerCells, "tfoot")

        const newWidth = Math.max(headerWidth, contentWidth, footerWidth)

        this.resize(panelIndex, column, newWidth)
    }

    #calculateAutoFitTable(table, cells, tagName) {
        const autoFitTable = table.cloneNode()
        autoFitTable.style.cssText = 'table-layout: auto;width: auto;'

        const autoFitBody = document.createElement(tagName)
        autoFitTable.appendChild(autoFitBody)

        for (const cell of cells) {
            const tr = document.createElement("tr")
            tr.appendChild(cell.cloneNode(true))

            autoFitBody.appendChild(tr)
        }

        document.body.appendChild(autoFitTable)
        const width = autoFitTable.getBoundingClientRect().width
        document.body.removeChild(autoFitTable)

        return width
    }

    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     * @param { number } panelIndex
     */
    #handleHeaderClick = (ev, panelModel, panelIndex) => {
        const target = ev.target

        if (target.role !== roles.resize) {
            return
        }

        ev.preventDefault()

        const th = target.closest("th")
        const column = panelModel.getColumn(th.dataset.uid)

        new ColumnResizeHandler(this.splitTable, column, th, panelIndex).start()
    }

}
