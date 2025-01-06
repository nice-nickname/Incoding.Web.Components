
class ColumnEdit {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { TablePanelModel }
     */
    panelModel

    constructor(splitTable, panelModel) {
        this.splitTable = splitTable
        this.panelModel = panelModel
    }

    rename(column, title) {
        this.panelModel.edit(editor => {
            editor.rename(column.uid, title)
        })

        this.splitTable.refreshHeader()
    }

    resize(column, width) {
        this.panelModel.edit(editor => {
            editor.resize(column.uid, width)
        })

        this.splitTable.refresh()
    }

    remove(column) {
        this.panelModel.edit(editor => {
            editor.remove(column.uid)
        })

        this.splitTable.refresh()
    }

    pin(column) {
        this.panelModel.edit(editor => {
            editor.pin(column.uid)
        })

        this.splitTable.refresh()
    }

    pinUntil(column) {
        const columns = this.panelModel.columns
        const columnsToPin = columns.slice(0, columns.indexOf(column) + 1)

        this.panelModel.edit(editor => {
            columnsToPin
                .filter(column => !(column.isPinned || column.isControlColumn()))
                .forEach(column => {
                    editor.pin(column.uid)
                })
        })

        this.splitTable.refresh()
    }

    unpin(column) {
        this.panelModel.edit(editor => {
            editor.unpin(column.uid)
        })

        this.splitTable.refresh()
    }

    unpinAll() {
        const columnsToUnpin = this.panelModel.columns
            .filter(column => column.isPinned)

        this.panelModel.edit(editor => {
            columnsToUnpin.forEach(column => {
                editor.unpin(column.uid)
            })
        })


        this.splitTable.refresh()
    }

    moveToStart(column) {
        this.#moveColumn(column, 0)
    }

    moveToEnd(column) {
        const lastIndex = this.panelModel.columns.length

        this.#moveColumn(column, lastIndex)
    }

    moveBefore(column, beforeColumnUid) {
        const beforeIndex = this.panelModel.columns.findIndex(column => column.uid === beforeColumnUid)

        this.#moveColumn(column, beforeIndex)
    }

    #moveColumn(column, position) {
        this.panelModel.edit(editor => {
            editor.moveColumn(column.uid, position)
        })

        this.splitTable.refresh()
    }

}
