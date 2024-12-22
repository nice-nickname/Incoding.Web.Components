
class RowGroup {

    static GROUP_FIELD = 'Group'

    static KEY_FIELD = 'Key'

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { ColumnModel | null }
     */
    groupedColumn = null


    constructor(splitTable) {
        this.splitTable = splitTable;
    }


    isGrouped() {
        return this.groupedColumn !== null
    }

    /**
     * @param { ColumnModel } groupColumn
     */
    groupBy(groupColumn) {
        const newData = this.#getGroupedData(groupColumn.getField())
        const newSchema = this.#getGroupedSchema()

        this.splitTable.dataSource.setData(newData)
        this.splitTable.schemaModel = newSchema

        this.groupedColumn = groupColumn

        this.splitTable.refresh()
    }

    ungroup() {
        this.groupedColumn = null;

        this.splitTable.dataSource.setData(this.#getUngroupedData())
        this.splitTable.refresh()
    }

    destroy() { }

    #getGroupedData(groupField) {
        let data = this.splitTable.dataSource.getData()
        if (this.isGrouped()) {
            data = this.#getUngroupedData()
        }

        const groupObj = Object.groupBy(data, item => item[groupField])

        return Object
            .entries(groupObj)
            .map(([key, value]) => {
                const item = { }
                item[RowGroup.KEY_FIELD] = key
                item[RowGroup.GROUP_FIELD] = value

                return item
            })
    }

    #getUngroupedData() {
        const data = this.splitTable.dataSource.getData()

        return data.flatMap(item => item[RowGroup.GROUP_FIELD])
    }

    #getGroupedSchema() {
        let schemas = this.splitTable.schemaModel
        if (this.isGrouped()) {
            schemas = this.#getUngroupedSchema()
        }

        const newSchema = schemas.map(panel => panel.clone(this.splitTable.services))

        for (let i = 0; i < newSchema.length; i++) {
            const newPanel = newSchema[i]
            const oldPanel = schemas[i]

            newPanel.nestedField = RowGroup.GROUP_FIELD
            newPanel.nested = oldPanel
        }

        return newSchema
    }

    #getUngroupedSchema() {
        return this.splitTable.schemaModel
            .map(panel => panel.nested)
    }

}
