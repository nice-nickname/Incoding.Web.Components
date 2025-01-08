
class CellExpandContentRenderer {

    /**
     * @param { SplitTable } splitTable
     */
    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    render(column, data) {
        const nestedField = this.splitTable.getNestedField()
        const nestedData = data[nestedField]

        if (nestedData && _.isArray(nestedData) && nestedData.length !== 0) {
            const button = document.createElement("button")
            button.className = `${classes.collapsed} ci-planifi ci-color-muted ci-h-color-base ci-d-color-base`
            button.role = roles.expand

            return button
        }
    }

};

class CellDropdownContentRenderer {

    /**
     * @param { SplitTable } splitTable
     */
    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    render(column, data) {
        const dropdownTmpl = this.splitTable.getDropdownTmpl()

        if (dropdownTmpl) {
            const button = document.createElement("button")
            button.className = `ci-planifi ci-dots-horizontal ci-color-muted ci-h-color-primary`
            button.role = roles.rowDropdown

            return button
        }
    }

};

class CellTextContentRenderer {

    /**
     * @param { SplitTable } splitTable
     */
    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    render(column, data) {
        const value = this.getValue(column, data)

        const textSpan = document.createElement("span")
        column.formatElement(value, textSpan)

        if (this.splitTable.rowGroup.isGrouped() && this.splitTable.rowGroup.groupedColumn.equals(column)) {
            const itemsCount = data[RowGroup.GROUP_FIELD].length

            textSpan.textContent += ` (${itemsCount})`
        }

        return textSpan
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    getValue(column, data) {
        let value = ''
        if (this.splitTable.rowGroup.isGrouped()) {
            const groupColumn = this.splitTable.rowGroup.groupedColumn

            if (groupColumn.equals(column)) {
                value = data[RowGroup.KEY_FIELD]
            }
            else if (column.type === ColumnType.Numeric && column.format !== ColumnFormat.Percentage) {
                const groupData = data[RowGroup.GROUP_FIELD]
                value = DataUtil.aggregate(groupData, column.getField(), "sum")
            }
        } else {
            value = column.getValue(data)
        }

        return value
    }
};

class CellTemplateContentRenderer {

    /**
     * @param { SplitTable } splitTable
     */
    constructor(splitTable) {
        this.splitTable = splitTable
    }

    /**
     * @param { ColumnModel } column
     * @param { object[] } data
     */
    render(column, data) {
        if (this.splitTable.rowGroup.isGrouped()) {
            return undefined
        }

        const template = document.createElement("div")

        template.innerHTML = ExecutableInsert.Template.render(column.contentTmpl, data)

        const formatElement = template.querySelector('.format')
        if (formatElement) {
            column.formatElement(column.getValue(data), formatElement)
        }

        return template;
    }
};

class CellRenderer {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable

        this.cells = {
            text: new CellTextContentRenderer(splitTable),
            template: new CellTemplateContentRenderer(splitTable),
            expand: new CellExpandContentRenderer(splitTable),
            dropdown: new CellDropdownContentRenderer(splitTable)
        }
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

        if (column.executableTmpl) {
            td.setAttribute('incoding', ExecutableInsert.Template.render(column.executableTmpl, data))
        }

        td.style.textAlign = column.alignment.toString().toLowerCase()

        const contentElements = this.#renderCellContent(column, data)

        if (_.isArray(contentElements)) {
            contentElements.forEach(el => {
                if (el) {
                    td.append(el)
                }
            })
        } else {
            td.append(contentElements)
        }

        return td;
    }

    #renderCellContent(column, data) {
        let result

        if (column.isControlColumn()) {
            if (column.controlColumn === ControlColumn.Expand) {
                result = this.cells.expand.render(column, data)
            }

            if (column.controlColumn === ControlColumn.Dropdown) {
                result = this.cells.dropdown.render(column, data)
            }
        }

        if (column.content) {
            const template = this.cells.template.render(column, data)

            result = [...template.children]
        }

        if (!column.content && column.field) {
            result = this.cells.text.render(column, data)
        }

        if (!_.isArray(result)) {
            result = [result]
        }

        return result
    }

}
