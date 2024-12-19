
class GroupCellRenderer {

    /**
     * @type { RowGroup }
     */
    group

    constructor(group) {
        this.group = group
    }

    /**
     * @param { ColumnModel } column
     * @param { object } data
     */
    render(column, data) {
        const groupColumn = this.group.groupedColumn

        const td = document.createElement('td')

        let value = ''
        if (column.field === groupColumn.field) {
            value = data["Key"]
        } else if (column.totalable) {
            value = DataUtil.aggregate(data["Group"], column.getField(), "sum")
        }

        const span = document.createElement('span')
        column.formatElement(value, span)

        if (column.field === groupColumn.field) {
            span.append(` (${data["Group"].length})`)
        }

        td.append(span)
        return td
    }

}
