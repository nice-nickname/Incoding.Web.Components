
class RowRenderer {

    /**
     * @type { SplitTable }
     */
    table

    #lastRowIndex = 0

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

        IncodingEngine.Current.parse(trs)
        table.tbody.append(...trs)

        this.removePlaceholders()
    }

    renderPlaceholders() {
        const tbody = this.table.tbody

        const trs = Array.from({ length: 3 }).map(_ => this.#renderPlaceholderRow())

        tbody.append(...trs)
    }

    removePlaceholders() {
        const tempTrs = this.table.tbody.querySelectorAll(`[role=${roles.temp}]`)

        for (const tr of tempTrs) {
            tr.remove()
        }
    }

    restart() {
        this.#lastRowIndex = 0
    }

    /**
     * @param { object } data
     * @param { Column[] } columns
     */
    #renderRow(data, columns) {
        const row = this.table.row

        const tds = []

        const tr = document.createElement('tr')
        tr.classList.add(...row.css)
        tr.dataset.index = this.#lastRowIndex++
        tr.role = roles.row

        if (row.executable) {
            tr.setAttribute('incoding',
                ExecutableInsert.Template.render(row.getExecutableFn(), data)
            )
        }

        for (let [attr, value] of Object.entries(row.attrs ?? {})) {
            if (attr.includes('!-')) {
                attr = ExecutableInsert.Template.render(
                    ExecutableInsert.Template.compile(SplitGridHelpers.decodeTempalte(attr)),
                    data
                )
            }

            if (value.includes('!-')) {
                value = ExecutableInsert.Template.render(
                    ExecutableInsert.Template.compile(SplitGridHelpers.decodeTempalte(value)),
                    data
                )
            }

            if (!ExecutableHelper.IsNullOrEmpty(attr)) {
                tr.setAttribute(attr, value)
            }
        }

        for (const column of columns) {
            const td = column.isControlColumn() ?
                this.#renderControlCell(column, data) :
                this.#renderCell(column, data)

            if (column.isPinned) {
                td.classList.add('pinned')
            }

            tds.push(td)
        }

        const pinnedColumnsLength = columns.filter(s => s.isPinned).length

        if (pinnedColumnsLength !== 0) {
            let pinOffset = 0
            for (let i = 0; i < pinnedColumnsLength; i++) {
                const column = columns[i];
                const td = tds[i]

                td.style.left = pinOffset + 'px'
                pinOffset += column.width

                if (i === pinnedColumnsLength - 1) {
                    td.classList.add('pinned-last')
                }
            }
        }

        tr.append(...tds)
        return tr
    }

    /**
     * @param { object } data
     * @param { Column } column
     * @returns { HTMLTableCellElement }
     */
    #renderCell(column, data) {
        const td = document.createElement('td')
        td.classList.add(...column.css)
        td.dataset.index = column.index
        td.dataset.uid = column.uid
        for (let [attr, value] of Object.entries(column.attrs ?? {})) {
            if (attr.includes('!-')) {
                attr = ExecutableInsert.Template.render(
                    ExecutableInsert.Template.compile(SplitGridHelpers.decodeTempalte(attr)),
                    data
                )
            }

            if (value.includes('!-')) {
                value = ExecutableInsert.Template.render(
                    ExecutableInsert.Template.compile(SplitGridHelpers.decodeTempalte(value)),
                    data
                )
            }

            if (!ExecutableHelper.IsNullOrEmpty(attr)) {
                td.setAttribute(attr, value)
            }
        }

        td.style.textAlign = column.alignment.toLocaleString().toLowerCase()

        if (column.executable) {
            td.setAttribute('incoding',
                ExecutableInsert.Template.render(column.getExecutableFn(), data)
            )
        }

        if (!column.content) {
            const span = document.createElement('span')
            const value = column.getValue(data)

            column.formatElement(value, span)

            td.append(span)

            return td
        }

        td.innerHTML = ExecutableInsert.Template.render(column.getTempalteFn(), data)

        return td
    }

    /**
     * @param { Column } column
     */
    #renderControlCell(column, data) {
        const td = document.createElement('td')
        td.classList.add(...column.css)

        if (column.controlColumn === ControlColumn.Expand &&
             data[this.table.nestedField] != null &&
             data[this.table.nestedField]?.length !== 0) {
            td.innerHTML = `<button role="${roles.expand}" class="${classes.collapsed}"></button>`
        }

        if (column.controlColumn === ControlColumn.Dropdown && this.table.row.dropdownTmpl) {
            td.innerHTML = `<button role="${roles.dropdown}"></button>`
        }

        return td
    }

    #renderPlaceholderRow() {
        const tr = document.createElement('tr')
        tr.role = 'temp'

        const columns = this.table.getFlatColumns()

        for (const column of columns) {
            const td = document.createElement('td')
            td.innerHTML = '<span class="table-placeholder">&nbsp;</span>'

            tr.appendChild(td)
        }

        return tr
    }
}
