
class RowRenderer {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table
    }


    /**
     * @param { object[] } data
     */
    render(data) {
        const table = this.table
        const colums = table.getFlatColumns()

        const trs = []

        for (const item of data) {
            trs.push(this.#renderRow(item, colums))
        }

        table.tbody.append(...trs)
    }

    /**
     * @param { object } data
     * @param { Column[] } columns
     */
    #renderRow(data, columns) {
        const row = this.table.row

        const tr = document.createElement('tr')
        tr.setAttribute('role', 'row')
        tr.classList.add(...row.css)

        for (const column of columns) {
            tr.append(this.#renderCell(data, column))
        }

        return tr
    }

    /**
     * @param { object } data
     * @param { Column } column
     * @returns { HTMLTableCellElement }
     */
    #renderCell(data, column) {
        const td = document.createElement('td')
        td.classList.add(...column.css)

        if (column.executable) {
            td.setAttribute('incoding',
                ExecutableInsert.Template.render(column.getExecutableFn(), data)
            )
        }

        if (!column.content) {
            const div = document.createElement('div')
            const value = column.getValue(data)

            column.formatValue(div, value, this.table.format)

            td.append(div)

            return td
        }

        td.innerHTML = ExecutableInsert.Template.render(column.getTempalteFn(), data)

        return td
    }
}
