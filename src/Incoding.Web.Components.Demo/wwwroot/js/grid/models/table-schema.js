
class TableSchema {

    /**
     * @type { string }
     */
    id

    /**
     * @type { string[] }
     */
    css

    /**
     * @type { Row }
     */
    row

    /**
     * @type { Column[] }
     */
    columns

    /**
     * @type { string }
     */
    nestedField

    /**
     * @type { TableSchema }
     */
    nested


    /**
     * @param { SplitTableModel } table
     */
    constructor(table) {
        this.id = table.id
        this.css = SplitGridHelpers.parseCss(table.css)
        this.row = new Row(table.row)
        this.columns = table.columns.map(c => new Column(c))

        if (table.nestedField) {
            this.nestedField = table.nestedField
            this.nested = new TableSchema(table.nested)
        }
    }
}
