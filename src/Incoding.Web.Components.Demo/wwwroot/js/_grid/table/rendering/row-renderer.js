
class RowRenderer {

    /**
     * @type { SplitTable }
     */
    splitTable

    #cellRenderer
    #dummyRenderer

    constructor(splitTable) {
        this.splitTable = splitTable

        this.#cellRenderer = new CellRenderer()
        this.#dummyRenderer = new DummyCellRenderer()
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
        const rowId = rowData["RowId"]

        const tr = this.#createRow(panelModel.row, rowIndex, rowId)

        const dummyRenderer = new DummyCellRenderer()
        const cellRenderer = this.splitTable.rowGroup.isGrouped()
            ? new GroupCellRenderer(this.splitTable.rowGroup)
            : new CellRenderer(this.splitTable)

        for (const column of columns) {
            const td = cellRenderer.render(column, rowData)
            td.dataset.rowIndex = rowIndex

            cellRenderer.render(column, rowData)

            tr.append(td)
        }

        tr.append(dummyRenderer.render())

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
