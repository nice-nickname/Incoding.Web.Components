
class CellRenderer {

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

        if (column.isControlColumn()) {
            td.append(this.#renderControlColumn(column, data))
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

       const { role, css } = elementsMap[column.controlColumn]
       const buttonElement = document.createElement('button');

       buttonElement.className = css
       buttonElement.role = role

       return buttonElement
    }

}

class DummyCellRenderer {

    constructor(tag = 'td') {
        this.tag = tag
    }

    render() {
        const td = document.createElement(this.tag)
        td.className = 'dummy'

        return td
    }

}
