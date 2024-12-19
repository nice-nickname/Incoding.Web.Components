
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
     * @param { RowModel } row
     * @param { ColumnModel[] } columns
     * @param { number } rowIndex
     */
    render(row, columns, rowIndex) {
        const data = this.splitTable.dataSource.getData()

        const rowData = data[rowIndex]

        const tr = this.#createRow()

        const dummyRenderer = new DummyCellRenderer()
        const cellRenderer = this.splitTable.rowGroup.isGrouped()
            ? new GroupCellRenderer(this.splitTable.rowGroup)
            : new CellRenderer()

        for (const column of columns) {
            const td = cellRenderer.render(column, rowData)
            td.dataset.rowIndex = rowIndex

            cellRenderer.render(column, rowData)

            tr.append(td)
        }

        tr.append(dummyRenderer.render())

        return tr
    }

    #createRow() {
        const tr = document.createElement("tr")

        return tr
    }

    /**
     * @param { ColumnModel } column
     */
    #createCell(column) {

    }

}
