
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
        const newData = this.#getGroupedData(groupColumn)
        const newSchema = this.#getGroupedSchema(groupColumn)

        this.groupedColumn = groupColumn

        this.splitTable.dataSource.setData(newData)
        this.splitTable.schemaModel = newSchema

        this.splitTable.refresh()
    }

    ungroup() {
        this.groupedColumn = null;

        this.splitTable.schemaModel = this.#getUngroupedSchema()

        this.splitTable.dataSource.setData(this.#getUngroupedData())
        this.splitTable.refresh()
    }

    destroy() { }

    #getGroupedData(groupColumn) {
        let data = this.splitTable.dataSource.getData()
        if (this.isGrouped()) {
            data = this.#getUngroupedData()
        }

        const groups = Object.entries(Object.groupBy(data, item => groupColumn.getValue(item)))

        return groups.map(([key, value]) => {
            const item = { }
            item[RowGroup.KEY_FIELD] = key
            item[RowGroup.GROUP_FIELD] = value
            item[RowModel.ROW_ID_FIELD] = key

            return item
        })
    }

    #getUngroupedData() {
        const data = this.splitTable.dataSource.getData()

        return data.flatMap(item => item[RowGroup.GROUP_FIELD])
    }

    #getGroupedSchema(groupColumn) {
        let schemas = this.splitTable.schemaModel
        if (this.isGrouped()) {
            schemas = this.#getUngroupedSchema()
        }
        const newSchema = schemas.map(panel => panel.clone(this.splitTable.services))

        for (let i = 0; i < newSchema.length; i++) {
            const newPanel = newSchema[i]
            const oldPanel = schemas[i]

            newPanel.row.executableTmpl = null
            newPanel.row.dropdownTmpl = null
            newPanel.nestedField = RowGroup.GROUP_FIELD
            newPanel.nested = oldPanel

            if (oldPanel.columns.indexOf(groupColumn) !== -1) {
                newPanel.edit(edit => edit.moveColumn(groupColumn.uid, 0))
            }

            for (const column of newPanel.getFlatColumns()) {
                const isGroupColumn = column.equals(groupColumn)

                column.executableTmpl = null
                column.contentTmpl = null

                if (!column.totalable && !isGroupColumn) {
                    column.field = null
                }
            }
        }

        return newSchema
    }

    #getUngroupedSchema() {
        return this.splitTable.schemaModel
            .map(panel => panel.nested)
    }

}
