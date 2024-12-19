
class RowGroup {

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
        this.groupedColumn=  groupColumn

        const data = this.splitTable.dataSource.getData()

        const group = Object.groupBy(data, item => item[groupColumn.field])
        const groupData = Object
            .entries(group)
            .map(([key, value]) => ({
                'Key': key,
                "Group": value
            }))

        this.splitTable.dataSource.setData(groupData)

        this.splitTable.refresh()
    }

    ungroup() {
        this.groupedColumn = null;

        this.splitTable.refresh()
    }

}
