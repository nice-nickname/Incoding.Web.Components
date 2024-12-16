
class TablePanelModel {

    /** @type { string } */
    id

    /** @type { ColumnModel[] } */
    columns

    /** @type { RowModel } */
    row

    /** @type { string[] } */
    css


    /** @type { TablePanelModel } */
    nested

    /**
     * @param { ISplitTable } table
     * @param { ServiceCollection } services
     */
    constructor(table, services) {
        const formatter = services.get(FormatService.NAME)

        this.id = table.id
        this.columns = table.columns.map(col => new ColumnModel(col, formatter));
        this.row = new RowModel(table.row)
        this.css = SplitGridHelpers.parseCss(table.css)

        if (table.nested) {
            this.nested = new TablePanelModel(table.nested, services)
        }
    }

}
