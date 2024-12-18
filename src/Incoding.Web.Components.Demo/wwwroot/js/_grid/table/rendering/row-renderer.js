
class RowRenderer {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(elements) {
        this.splitTable = splitTable
    }

    render() {
        const trs = []

        for (const tableModel of this.splitTable.schemaModel) {
            trs.push(this.renderPanel(tableModel))
        }

        return trs
    }

    /**
     * @param { TablePanelModel } tableModel
     */
    renderPanel(tableModel) {
        const tr = document.createElement('tr')

        tableModel.columns.forEach((column) => {

        })

        return tr
    }


}
