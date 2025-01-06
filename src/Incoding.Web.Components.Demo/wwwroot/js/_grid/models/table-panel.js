
class TablePanelModel {

    /** @type { string } */
    id

    /** @type { ColumnModel[] } */
    columns

    /** @type { RowModel } */
    row

    /** @type { string } */
    css


    /** @type { TablePanelModel } */
    nested

    /** @type { string } */
    nestedField


    /** @type { GridMode } */
    mode


    /** @type { TablePanelEditor } */
    #editor


    /**
     * @param { ISplitTable } table
     * @param { ServiceCollection } services
     * @param { GridMode } mode
     */
    constructor(table, services, mode = GridMode.SubGrid) {
        const formatter = services.get(FormatService.NAME)

        this.id = table.id
        this.columns = table.columns.map(col => new ColumnModel(col, formatter));
        this.row = new RowModel(table.row)
        this.css = table.css

        this.mode = mode

        if (table.nested) {
            this.nested = new TablePanelModel(table.nested, services)
            this.nestedField = table.nestedField
        }

        this.#editor = new TablePanelEditor(this)
    }

    getFlatColumns() {
        const columns = []

        for (const column of this.columns) {
            if (column.stacked.length) {
                columns.push(...column.stacked)
            } else {
                columns.push(column)
            }
        }

        return columns
    }

    getControlColumns() {
        return this.columns.filter(column => column.isControlColumn());
    }

    /**
     * @param { string } uid
     * @returns { ColumnModel | null }
     */
    getColumn(uid) {
        const searchColumn = (columns) => {
            for (const column of columns) {
                if (column.uid === uid) {
                    return column
                }

                if (column.isStacked()) {
                    let stacked = searchColumn(column.stacked, uid)

                    if (stacked) {
                        return stacked
                    }
                }
            }

            return null
        }

        return searchColumn(this.columns)
    }

    /**
     * @param { (editor: TablePanelEditor) => void } callback
     */
    edit(callback) {
        callback(this.#editor)

        if (this.mode === GridMode.Stacked && this.nested) {
            this.nested.edit(callback)
        }
    }

    clone(services) {
        const table = new TablePanelModel(
            {
                id: this.id,
                css: this.css,
                row: { },
                columns: [],
            },
            services, this.mode)

        table.row = this.row.clone()
        table.columns = this.columns.map(column => column.clone())

        return table
    }

}
