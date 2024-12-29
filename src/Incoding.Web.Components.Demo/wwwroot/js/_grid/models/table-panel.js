
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

    /**
     * @param { ISplitTable } table
     * @param { ServiceCollection } services
     */
    constructor(table, services) {
        const formatter = services.get(FormatService.NAME)

        this.id = table.id
        this.columns = table.columns.map(col => new ColumnModel(col, formatter));
        this.row = new RowModel(table.row)
        this.css = table.css

        if (table.nested) {
            this.nested = new TablePanelModel(table.nested, services)
            this.nestedField = table.nestedField
        }
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

    clone(services) {
        const table = new TablePanelModel(
            {
                id: this.id,
                css: this.css,
                row: { },
                columns: [],
            },
            services)

        table.row = this.row.clone()
        table.columns = this.columns.map(column => column.clone())

        return table
    }

}
