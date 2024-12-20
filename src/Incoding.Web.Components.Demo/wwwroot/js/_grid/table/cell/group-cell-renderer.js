
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

        if (column.isControlColumn()) {
            td.append(this.#renderControlColumn(column, data))
            return td;
        }

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

    /**
     * @param { ColumnModel } column
     * @param { Object } data
     */
    #renderControlColumn(column, data) {
        const elementsMap = {
            [ControlColumn.Expand]: { role: roles.expand, css: `${classes.collapsed} ci-planifi ci-color-muted ci-h-color-base ci-d-color-base` },
            [ControlColumn.Dropdown]: { role: roles.rowDropdown, css: `ci-planifi ci-dots-horizontal ci-color-muted ci-h-color-primary` },
        }

        const { role, css } = elementsMap[column.controlColumn]
        const buttonElement = document.createElement('button');

        buttonElement.className = css
        buttonElement.role = role

        return buttonElement
    }

}
