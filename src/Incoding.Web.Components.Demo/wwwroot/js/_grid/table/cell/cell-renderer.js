
class CellRenderer {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { ColumnModel } column
     * @param { Object } data
     * @returns { HTMLElement }
     */
    render(column, data) {
        const td = document.createElement('td')

        td.className = column.css
        td.dataset.uid = column.uid
        td.dataset.index = column.index
        td.dataset.colIndex = column.index

        td.style.textAlign = column.alignment.toString().toLowerCase()

        if (column.isControlColumn() ) {
            const btn = this.#renderControlColumn(column, data)
            if (btn) {
                td.append(btn)
            }
            return td;
        }

        if (column.content) {
            td.innerHTML = ExecutableInsert.Template.render(column.getTempalteFn(), data)

            const formatElement = td.querySelector('.format')

            if (formatElement) {
                column.formatElement(column.getValue(data), formatElement)
            }

            return td;
        }

        const span = document.createElement('span')
        column.formatElement(column.getValue(data), span)

        td.appendChild(span)

        return td;
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

       const nestedField = this.splitTable.getNestedField()

       if (column.controlColumn === ControlColumn.Expand &&
           (data[nestedField]?.length === undefined || data[nestedField].length === 0)) {
           return null;
       }

       const { role, css } = elementsMap[column.controlColumn]
       const buttonElement = document.createElement('button');

       buttonElement.className = css
       buttonElement.role = role

       return buttonElement
    }

}
