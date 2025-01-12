
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
        if (this.splitTable.filter.isFiltered()) {
            this.splitTable.filter.clearFilters()
        }

        const newData = this.#getGroupedData(groupColumn)
        const newSchema = this.#getGroupedSchema(groupColumn)

        this.groupedColumn = groupColumn

        this.splitTable.dataSource = new DataSource(newData)
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

        const columns = this.splitTable.getAllFlatColumns()

        return groups.map(([key, values]) => {
            const item = { }
            item[RowGroup.KEY_FIELD] = key
            item[RowModel.ROW_ID_FIELD] = key
            item[RowGroup.GROUP_FIELD] = values

            const getValue = (column) => {
                if (column.type === ColumnType.Boolean) {
                    return column.getValue(values[0])
                }

                if (column.totalable) {
                    return DataUtil.aggregate(values, column.getField(), 'sum')
                }

                return ''
            }

            columns.forEach((column) => {
                if (column.spreadField !== null) {
                    if (!item[column.spreadField]) {
                        item[column.spreadField] = []
                    }

                    if (!item[column.spreadField][column.spreadIndex]) {
                        item[column.spreadField][column.spreadIndex] = { }
                    }

                    const spreadItem = item[column.spreadField][column.spreadIndex]

                    spreadItem[column.field] = getValue(column)
                }

                if (column.field !== null) {
                    item[column.field] = getValue(column)
                }
            })

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

        for (let panelIndex = 0; panelIndex < newSchema.length; panelIndex++) {
            const newPanel = newSchema[panelIndex]
            const oldPanel = schemas[panelIndex]

            newPanel.row.executableTmpl = null
            newPanel.row.dropdownTmpl = null
            newPanel.nestedField = RowGroup.GROUP_FIELD
            newPanel.nested = oldPanel

            if (panelIndex === 0 && newPanel.columns.findIndex(({ controlColumn }) => controlColumn === ControlColumn.Expand) === -1) {
                newPanel.columns.unshift(ColumnModel.ControlColumn(ControlColumn.Expand))
            }

            if (oldPanel.columns.indexOf(groupColumn) !== -1) {
                newPanel.edit(edit => edit.pin(groupColumn.uid))
            }

            for (const column of newPanel.getFlatColumns()) {
                const isGroupColumn = column.equals(groupColumn)

                column.executableTmpl = null

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
