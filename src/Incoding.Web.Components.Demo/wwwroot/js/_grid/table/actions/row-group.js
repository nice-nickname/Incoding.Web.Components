
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
        this.groupedColumn =  groupColumn

        let data = this.splitTable.dataSource.getData()
        if (this.isGrouped()) {
            data = this.#getUngroupedData()
        }

        const newData = this.#getGroupedData(groupColumn.getField())

        this.splitTable.dataSource.setData(newData)
        this.splitTable.refresh()
    }

    ungroup() {
        this.groupedColumn = null;

        this.splitTable.dataSource.setData(this.#getUngroupedData())
        this.splitTable.refresh()
    }

    destroy() { }

    #getGroupedData(groupField) {
        const data = this.splitTable.dataSource.getData()

        const groupObj = Object.groupBy(data, item => item[groupField])

        return Object
            .entries(groupObj)
            .map(([key, value]) => ({
                'Key': key,
                "Group": value
            }))
    }

    #getUngroupedData() {
        const data = this.splitTable.dataSource.getData()

        return data.flatMap(item => item['Group'])
    }

}
