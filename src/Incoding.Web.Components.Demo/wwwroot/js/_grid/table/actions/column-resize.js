
class ColumnResize {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable
    }

    destroy() { }

    /**
     * @param { TablePanelModel } panelModel 
     */
    autoFitAll(panelModel) {
        const columns = panelModel.getFlatColumns().filter(col => col.resizable)

        for (const column of columns) {
            this.autoFit(column)
        }
    }

    /**
     * @param { ColumnModel } column 
     */
    autoFit(column) {

    }
    
}