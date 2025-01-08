
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
        const columns = panelModel.getFlatColumns()

        const data = this.splitTable.dataSource.getData()
        const rowData = data[rowIndex]

        const tr = this.#createRow(panelModel.row, rowData, rowIndex)

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

        for (let i = 0; i < panelModel.getFlatColumns().length; i++) {
            const td = document.createElement('td')
            td.innerHTML = '<span class="table-placeholder">&nbsp;</span>'

            tr.append(td)
        }

        return tr
    }

    /**
     * @param { RowModel } row
     */
    #createRow(row, rowData, rowIndex) {
        const tr = document.createElement("tr")
        tr.role = roles.row
        tr.dataset.rowIndex = rowIndex
        tr.dataset.rowId = rowData[RowModel.ROW_ID_FIELD]

        if (row.executableTmpl) {
            tr.setAttribute('incoding', ExecutableInsert.Template.render(row.executableTmpl, rowData))
        }

        return tr
    }

}
