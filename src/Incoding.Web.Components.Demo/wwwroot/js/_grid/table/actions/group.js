
class ColumnGroup {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { ColumnGroup | null }
     */
    groupedColumn = null


    constructor(splitTable) {
        this.splitTable = splitTable;
    }

    groupBy(groupColumn) {
        this.groupedColumn = groupColumn

        const data = this.splitTable.dataSource.getData()

        const groupObj = Object.groupBy(data, groupColumn.field)

        const groupedData = []
        Object.entries(groupObj).forEach(([key, value]) => {
            const rowItem = { }

            rowItem[groupColumn.field] = key
            rowItem['Children'] = value

            groupedData.push(rowItem)
        })

        this.splitTable.dataSource.clear()
        this.splitTable.dataSource.appendData(data)


    }

    ungroup() {
        this.groupedColumn = null;
    }

}
