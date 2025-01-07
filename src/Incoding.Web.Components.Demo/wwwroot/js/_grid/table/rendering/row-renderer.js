
class RowRenderer {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { TablePanelModel } panelModel
     * @param { number } rowIndex
     */
    render(panelModel, rowIndex) {
        const row = panelModel.row
        const columns = panelModel.getFlatColumns()

        const data = this.splitTable.dataSource.getData()
        const rowData = data[rowIndex]
        const rowId = rowData[RowModel.ROW_ID_FIELD]

        const tr = this.#createRow(panelModel.row, rowIndex, rowId)

        const cellRenderer = new CellRenderer(this.splitTable)

        for (const column of columns) {
            const td = cellRenderer.render(column, rowData)
            td.dataset.rowIndex = rowIndex

            cellRenderer.render(column, rowData)

            tr.append(td)
        }

        return tr
    }

    /**
     * @param { TablePanelModel } panelModel
     */
    renderLoadingRow(panelModel) {
        const tr = document.createElement('tr')
        tr.role = roles.temp

        for (let i = 0; i < panelModel.getFlatColumns().length + 1; i++) {
            const td = document.createElement('td')
            td.innerHTML = '<span class="table-placeholder">&nbsp;</span>'

            tr.append(td)
        }

        return tr
    }

    /**
     * @param { RowModel } row
     */
    #createRow(row, rowIndex, rowId) {
        const tr = document.createElement("tr")
        tr.role = roles.row
        tr.dataset.rowIndex = rowIndex
        tr.dataset.rowId = rowId

        return tr
    }

}
